import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { wsService } from "../services/websocketService.js";
import MonacoEditor from "@monaco-editor/react";
import "../styles/editor.css";

const API_BASE = "http://localhost:8080";

const MONACO_LANG = {
  javascript: "javascript", typescript: "typescript", python: "python",
  java: "java", cpp: "cpp", csharp: "csharp", go: "go",
  php: "php", ruby: "ruby", html: "html", css: "css",
};

const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python",     label: "Python"     },
  { value: "java",       label: "Java"       },
  { value: "cpp",        label: "C++"        },
  { value: "csharp",     label: "C#"         },
  { value: "go",         label: "Go"         },
  { value: "php",        label: "PHP"        },
  { value: "ruby",       label: "Ruby"       },
  { value: "html",       label: "HTML"       },
  { value: "css",        label: "CSS"        },
];

const FILE_EXTENSIONS = {
  javascript: "js", typescript: "ts", python: "py", java: "java",
  cpp: "cpp", csharp: "cs", go: "go", php: "php",
  ruby: "rb", html: "html", css: "css",
};

const AVATAR_COLORS = ["ed-av-purple","ed-av-teal","ed-av-amber","ed-av-pink","ed-av-sky"];

function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}
function initials(name) { return (name || "U").trim()[0]?.toUpperCase() || "U"; }

const Icon = {
  back: (p) => <svg {...p} viewBox="0 0 16 16" fill="none"><path d="M10 13L5 8l5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  spinner: (p) => <svg {...p} viewBox="0 0 16 16" fill="none" className={`ed-spin ${p.className||""}`}><circle cx="8" cy="8" r="6.2" stroke="currentColor" strokeWidth="1.6" strokeOpacity="0.25"/><path d="M14.2 8a6.2 6.2 0 00-6.2-6.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  check: (p) => <svg {...p} viewBox="0 0 16 16" fill="none"><path d="M3 8.5l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  close: (p) => <svg {...p} viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  users: (p) => <svg {...p} viewBox="0 0 16 16" fill="none"><circle cx="6" cy="5.5" r="2.2" stroke="currentColor" strokeWidth="1.4"/><path d="M1.8 13c0-2.3 1.9-4 4.2-4s4.2 1.7 4.2 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M10.3 4.3c1.1.2 1.9 1.2 1.9 2.4 0 1.1-.7 2-1.7 2.3M12 9.3c1.4.4 2.4 1.6 2.4 3.1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  download: (p) => <svg {...p} viewBox="0 0 16 16" fill="none"><path d="M8 2v8M5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
};

function LogoMark() {
  return (
      <div className="ed-logo-mark">
        <span className="ed-lm ed-lm-1"/><span className="ed-lm ed-lm-2"/>
        <span className="ed-lm ed-lm-3"/><span className="ed-lm ed-lm-4"/>
      </div>
  );
}

export default function EditorPage() {
  const { docId } = useParams();
  const navigate  = useNavigate();
  const editorRef = useRef(null);   // Monaco editor instance
  const saveTimer = useRef(null);
  // KEY FIX: track whether we are currently applying a remote update
  // so handleCodeChange won't re-broadcast it back
  const suppressBroadcast = useRef(false);

  const [doc,          setDoc]          = useState(null);
  const [code,         setCode]         = useState("");
  const [language,     setLanguage]     = useState("javascript");
  const [loading,      setLoading]      = useState(true);
  const [pageError,    setPageError]    = useState("");
  const [saveStatus,   setSaveStatus]   = useState("saved");
  const [titleEditing, setTitleEditing] = useState(false);
  const [titleDraft,   setTitleDraft]   = useState("");
  const [showMembers,  setShowMembers]  = useState(false);
  const [memberUsername, setMemberUsername] = useState("");
  const [memberError,  setMemberError]  = useState("");
  const [addingMember, setAddingMember] = useState(false);
  const [cursorPos,    setCursorPos]    = useState({ line: 1, col: 1 });
  const [wsConnected,  setWsConnected]  = useState(false);
  const [activeUsers,  setActiveUsers]  = useState([]);

  /* ── Load document + wire WebSocket ── */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    fetchDocument();

    wsService.connect()
        .then(() => {
          setWsConnected(true);
          const username = localStorage.getItem("username");

          // Tell the server we joined
          wsService.joinDocument(docId, username);

          // Subscribe to real-time edits on this document's topic
          wsService.subscribeToDocument(docId, (message) => {
            // ── INSTANT UPDATE FIX ──────────────────────────────────────
            // Instead of setCode() (which goes through React state + re-render
            // and triggers onChange → re-broadcast loop), we push the value
            // DIRECTLY into Monaco's model. This is synchronous and does NOT
            // fire onChange, so there's zero echo.
            if (message.content !== undefined && editorRef.current) {
              const model = editorRef.current.getModel();
              if (model) {
                suppressBroadcast.current = true;
                // pushEditOperations preserves undo history and cursor position
                const fullRange = model.getFullModelRange();
                model.pushEditOperations(
                    [],
                    [{ range: fullRange, text: message.content }],
                    () => null
                );
                suppressBroadcast.current = false;
              }
              // Also sync React state so queueSave has the latest value
              setCode(message.content);
            }

            // Sync language if sender changed it
            if (message.language) setLanguage(message.language);

            // Track who is active
            if (message.username) {
              setActiveUsers((prev) => {
                if (prev.includes(message.username)) return prev;
                return [...prev, message.username];
              });
            }
          });
        })
        .catch((err) => {
          console.error("WebSocket connect failed:", err);
          setWsConnected(false);
        });

    return () => { wsService.disconnect(); };
  }, [docId]);

  const fetchDocument = async () => {
    setLoading(true);
    setPageError("");
    try {
      const res  = await fetch(`${API_BASE}/documents/${docId}`, { headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load document.");
      setDoc(data);
      setCode(data.content || "");
      setLanguage(data.language || "javascript");
      setTitleDraft(data.title || "");
    } catch (err) {
      setPageError(err.message || "Failed to load document.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Autosave (debounced 800 ms) ── */
  const queueSave = useCallback((nextCode, nextLang, nextTitle) => {
    setSaveStatus("unsaved");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      setSaveStatus("saving");
      try {
        const res = await fetch(`${API_BASE}/documents/${docId}`, {
          method: "PUT",
          headers: authHeaders(),
          body: JSON.stringify({ content: nextCode, language: nextLang, title: nextTitle }),
        });
        if (!res.ok) throw new Error();
        setSaveStatus("saved");
      } catch { setSaveStatus("error"); }
    }, 800);
  }, [docId]);

  /* ── Local edit: update state + broadcast + queue save ── */
  const handleCodeChange = (value) => {
    // If suppressBroadcast is true, this onChange was fired by our own
    // model.pushEditOperations call — skip broadcast to prevent echo loop
    if (suppressBroadcast.current) return;

    const next = value ?? "";
    setCode(next);
    queueSave(next, language, doc?.title);

    // Broadcast to all other clients via WebSocket
    const username = localStorage.getItem("username");
    wsService.sendEdit(docId, next, language, username);
  };

  const handleLanguageChange = (e) => {
    const next = e.target.value;
    setLanguage(next);
    queueSave(code, next, doc?.title);
    // Broadcast language change too
    const username = localStorage.getItem("username");
    wsService.sendEdit(docId, code, next, username);
  };

  const commitTitle = () => {
    setTitleEditing(false);
    const next = titleDraft.trim() || doc?.title || "Untitled";
    setDoc((d) => ({ ...d, title: next }));
    queueSave(code, language, next);
  };

  /* ── Download file ── */
  const handleDownload = () => {
    const ext      = FILE_EXTENSIONS[language] || "txt";
    const filename = `${doc?.title || "untitled"}.${ext}`;
    const blob     = new Blob([code], { type: "text/plain" });
    const url      = URL.createObjectURL(blob);
    const a        = document.createElement("a");
    a.href         = url;
    a.download     = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ── Add member ── */
  const handleAddMember = async () => {
    if (!memberUsername.trim()) { setMemberError("Enter a username."); return; }
    setAddingMember(true);
    setMemberError("");
    try {
      const res = await fetch(
          `${API_BASE}/documents/${docId}/members?username=${encodeURIComponent(memberUsername.trim())}`,
          { method: "POST", headers: authHeaders() }
      );
      const text = await res.text();
      if (!res.ok) throw new Error(text || "Could not add that user.");
      setDoc((d) => ({ ...d, members: [...(d.members || []), { username: memberUsername.trim() }] }));
      setMemberUsername("");
    } catch (err) {
      setMemberError(err.message || "Could not add that user.");
    } finally { setAddingMember(false); }
  };

  const saveLabel = { saved: "Saved", saving: "Saving…", unsaved: "Unsaved", error: "Save failed" }[saveStatus] ?? "Saved";
  const members   = doc?.members || [];
  // Merge stored members + currently active WS users for the avatar strip
  const allUsers  = [...new Set([...members.map(m => m.username), ...activeUsers])];

  /* ── Loading / error ── */
  if (loading) return (
      <div className="ed-loading-screen">
        <Icon.spinner className="ed-loading-spinner"/>
        <span className="ed-loading-text">Loading document…</span>
      </div>
  );
  if (pageError) return (
      <div className="ed-error-screen">
        <p className="ed-error-text">{pageError}</p>
        <button className="ed-error-link" onClick={() => navigate("/dashboard")}>← Back to dashboard</button>
      </div>
  );

  return (
      <div className="ed-page">

        {/* ══════════════════ TOP BAR ══════════════════ */}
        <header className="ed-topbar">
          <div className="ed-topbar-left">
            <button onClick={() => navigate("/dashboard")} className="ed-icon-btn" aria-label="Back">
              <Icon.back className="ed-icon"/>
            </button>
            <LogoMark/>
            <div className="ed-topbar-divider"/>

            {titleEditing ? (
                <input
                    autoFocus
                    value={titleDraft}
                    onChange={(e) => setTitleDraft(e.target.value)}
                    onBlur={commitTitle}
                    onKeyDown={(e) => e.key === "Enter" && commitTitle()}
                    className="ed-title-input"
                />
            ) : (
                <button
                    onClick={() => { setTitleEditing(true); setTitleDraft(doc?.title || ""); }}
                    className="ed-title-btn"
                    title="Click to rename"
                >
                  {doc?.title || "Untitled"}
                </button>
            )}

            <span className="ed-lang-pill">{language.toUpperCase()}</span>
          </div>

          <div className="ed-topbar-right">
            {/* Save status */}
            <div className="ed-save-status">
              {saveStatus === "saving"  && <Icon.spinner className="ed-icon ed-icon-muted"/>}
              {saveStatus === "saved"   && <Icon.check   className="ed-icon ed-icon-green"/>}
              {saveStatus === "error"   && <span className="ed-status-dot ed-dot-red"/>}
              {saveStatus === "unsaved" && <span className="ed-status-dot ed-dot-amber"/>}
              <span className="ed-save-label">{saveLabel}</span>
            </div>

            <div className="ed-topbar-divider"/>

            {/* Live indicator */}
            <div className="ed-live-badge">
              <span className={`ed-live-dot ${wsConnected ? "ed-live-dot-on" : "ed-live-dot-off"}`}/>
              <span>{wsConnected ? `${allUsers.length + 1} live` : "Offline"}</span>
            </div>

            {/* Active user avatars */}
            {allUsers.length > 0 && (
                <div className="ed-avatars">
                  {allUsers.slice(0, 4).map((u, i) => (
                      <div key={u} className={`ed-avatar ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`} title={u}>
                        {initials(u)}
                      </div>
                  ))}
                  {allUsers.length > 4 && <div className="ed-avatar ed-av-gray">+{allUsers.length - 4}</div>}
                </div>
            )}

            {/* Share popover */}
            <div className="ed-popover-wrap">
              <button onClick={() => setShowMembers((s) => !s)} className="ed-ghost-btn">
                <Icon.users className="ed-icon"/>
                <span>Share</span>
              </button>
              {showMembers && (
                  <div className="ed-popover">
                    <div className="ed-popover-header">
                      <span className="ed-popover-title">Add collaborator</span>
                      <button onClick={() => setShowMembers(false)} className="ed-icon-btn" aria-label="Close">
                        <Icon.close className="ed-icon"/>
                      </button>
                    </div>
                    <div className="ed-popover-input-row">
                      <input
                          value={memberUsername}
                          onChange={(e) => { setMemberUsername(e.target.value); setMemberError(""); }}
                          onKeyDown={(e) => e.key === "Enter" && handleAddMember()}
                          placeholder="Username"
                          className="ed-popover-input"
                          autoFocus
                      />
                      <button onClick={handleAddMember} disabled={addingMember} className="ed-popover-add-btn">
                        {addingMember ? <Icon.spinner className="ed-icon"/> : "Add"}
                      </button>
                    </div>
                    {memberError && <p className="ed-popover-error">{memberError}</p>}
                    {members.length > 0 && (
                        <div className="ed-popover-list">
                          {members.map((c, i) => (
                              <div key={c.id || i} className="ed-popover-list-row">
                                <div className={`ed-avatar-sm ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                                  {initials(c.username || c.name)}
                                </div>
                                <span>{c.username || c.name}</span>
                              </div>
                          ))}
                        </div>
                    )}
                  </div>
              )}
            </div>

            {/* Language selector */}
            <select value={language} onChange={handleLanguageChange} className="ed-lang-select" aria-label="Language">
              {LANGUAGES.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>

            {/* Download button */}
            <button onClick={handleDownload} className="ed-ghost-btn" title="Download file">
              <Icon.download className="ed-icon"/>
              <span>Download</span>
            </button>
          </div>
        </header>

        {/* ══════════════════ EDITOR BODY ══════════════════ */}
        <div className="ed-body">
          <div className="ed-monaco-wrap">
            <MonacoEditor
                height="100%"
                language={MONACO_LANG[language] || "plaintext"}
                value={code}
                theme="vs-dark"
                onChange={handleCodeChange}
                onMount={(editor) => {
                  editorRef.current = editor;
                  editor.onDidChangeCursorPosition((e) => {
                    setCursorPos({ line: e.position.lineNumber, col: e.position.column });
                  });
                }}
                options={{
                  fontSize: 14,
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  minimap: { enabled: true },
                  smoothScrolling: true,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  padding: { top: 16 },
                  renderLineHighlight: "all",
                  cursorBlinking: "smooth",
                  cursorSmoothCaretAnimation: "on",
                  bracketPairColorization: { enabled: true },
                }}
            />
          </div>

        </div>

        {/* ══════════════════ STATUS BAR ══════════════════ */}
        <footer className="ed-statusbar">
          <div className="ed-statusbar-left">
            <span>Ln {cursorPos.line}, Col {cursorPos.col}</span>
            <span className="ed-statusbar-sep"/>
            <span>Spaces: 2</span>
            <span className="ed-statusbar-sep"/>
            <span>UTF-8</span>
          </div>
          <div className="ed-statusbar-right">
            <span className="ed-statusbar-lang">{language.toUpperCase()}</span>
            <span className="ed-statusbar-sep"/>
            <span className={wsConnected ? "ed-status-green" : "ed-status-muted"}>
            {wsConnected ? "⬡ Live" : "⬡ Disconnected"}
          </span>
          </div>
        </footer>
      </div>
  );
}