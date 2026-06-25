import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Editor from "@monaco-editor/react";
import "../styles/editor.css";

const API_BASE = "http://localhost:8080/api";

/* Maps our app's language keys to Monaco's language ids */
const MONACO_LANG = {
  javascript: "javascript",
  typescript: "typescript",
  python: "python",
  java: "java",
  cpp: "cpp",
  csharp: "csharp",
  go: "go",
  php: "php",
  ruby: "ruby",
  html: "html",
  css: "css",
};

const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "csharp", label: "C#" },
  { value: "go", label: "Go" },
  { value: "php", label: "PHP" },
  { value: "ruby", label: "Ruby" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
];

const AVATAR_COLORS = ["ed-avatar-purple", "ed-avatar-green", "ed-avatar-amber", "ed-avatar-pink", "ed-avatar-sky"];

function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function initials(name) {
  return (name || "U").trim()[0]?.toUpperCase() || "U";
}

/* ---- Icons (inline, no extra deps) ---- */
const Icon = {
  back: (p) => <svg {...p} viewBox="0 0 16 16" fill="none"><path d="M10 13L5 8l5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  play: (p) => <svg {...p} viewBox="0 0 16 16" fill="none"><path d="M4 2.8v10.4a.6.6 0 00.92.5l8.3-5.2a.6.6 0 000-1l-8.3-5.2a.6.6 0 00-.92.5z" fill="currentColor" /></svg>,
  spinner: (p) => <svg {...p} viewBox="0 0 16 16" fill="none" className={`animate-spin ${p.className || ""}`}><circle cx="8" cy="8" r="6.2" stroke="currentColor" strokeWidth="1.6" strokeOpacity="0.25" /><path d="M14.2 8a6.2 6.2 0 00-6.2-6.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>,
  check: (p) => <svg {...p} viewBox="0 0 16 16" fill="none"><path d="M3 8.5l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  plus: (p) => <svg {...p} viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>,
  close: (p) => <svg {...p} viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>,
  chevron: (p) => <svg {...p} viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  terminal: (p) => <svg {...p} viewBox="0 0 16 16" fill="none"><rect x="1.5" y="2.5" width="13" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.4" /><path d="M4 6l2.2 2-2.2 2M7.5 10h4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  users: (p) => <svg {...p} viewBox="0 0 16 16" fill="none"><circle cx="6" cy="5.5" r="2.2" stroke="currentColor" strokeWidth="1.4" /><path d="M1.8 13c0-2.3 1.9-4 4.2-4s4.2 1.7 4.2 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /><path d="M10.3 4.3c1.1.2 1.9 1.2 1.9 2.4 0 1.1-.7 2-1.7 2.3M12 9.3c1.4.4 2.4 1.6 2.4 3.1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>,
};

export default function EditorPage() {
  const { docId } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const saveTimer = useRef(null);

  const [doc, setDoc] = useState(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [saveStatus, setSaveStatus] = useState("saved"); // saved | saving | unsaved | error
  const [titleEditing, setTitleEditing] = useState(false);
  const [titleDraft, setTitleDraft] = useState("");

  const [showMembers, setShowMembers] = useState(false);
  const [memberUsername, setMemberUsername] = useState("");
  const [memberError, setMemberError] = useState("");
  const [addingMember, setAddingMember] = useState(false);

  const [showOutput, setShowOutput] = useState(true);
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState("");

  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });

  /* ---- Load document ---- */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchDocument();
  }, [docId]);

  const fetchDocument = async () => {
    setLoading(true);
    setPageError("");
    try {
      const res = await fetch(`${API_BASE}/documents/${docId}`, { headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load document.");
      setDoc(data);
      setCode(data.content || "");
      setLanguage(data.language || "javascript");
      setTitleDraft(data.name || "");
    } catch (err) {
      setPageError(err.message || "Failed to load document.");
    } finally {
      setLoading(false);
    }
  };

  /* ---- Autosave (debounced) ---- */
  const queueSave = useCallback((nextCode, nextLanguage, nextName) => {
    setSaveStatus("unsaved");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      setSaveStatus("saving");
      try {
        const res = await fetch(`${API_BASE}/documents/${docId}`, {
          method: "PUT",
          headers: authHeaders(),
          body: JSON.stringify({
            content: nextCode,
            language: nextLanguage,
            name: nextName,
          }),
        });
        if (!res.ok) throw new Error();
        setSaveStatus("saved");
      } catch {
        setSaveStatus("error");
      }
    }, 800);
  }, [docId]);

  const handleCodeChange = (value) => {
    setCode(value ?? "");
    queueSave(value ?? "", language, doc?.name);
  };

  const handleLanguageChange = (e) => {
    const next = e.target.value;
    setLanguage(next);
    queueSave(code, next, doc?.name);
  };

  const commitTitle = () => {
    setTitleEditing(false);
    const next = titleDraft.trim() || doc?.name || "Untitled";
    setDoc((d) => ({ ...d, name: next }));
    queueSave(code, language, next);
  };

  /* ---- Run code ---- */
  const handleRun = async () => {
    setRunning(true);
    setShowOutput(true);
    setOutput("");
    try {
      const res = await fetch(`${API_BASE}/documents/${docId}/run`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ content: code, language }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Execution failed.");
      setOutput(data.output ?? data.stdout ?? "No output.");
    } catch (err) {
      setOutput(`Error: ${err.message || "Execution failed."}`);
    } finally {
      setRunning(false);
    }
  };

  /* ---- Add collaborator ---- */
  const handleAddMember = async () => {
    if (!memberUsername.trim()) {
      setMemberError("Enter a username.");
      return;
    }
    setAddingMember(true);
    setMemberError("");
    try {
      const res = await fetch(`${API_BASE}/documents/${docId}/collaborators`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ username: memberUsername.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Could not add that user.");
      setDoc((d) => ({ ...d, collaborators: [...(d.collaborators || []), data] }));
      setMemberUsername("");
    } catch (err) {
      setMemberError(err.message || "Could not add that user.");
    } finally {
      setAddingMember(false);
    }
  };

  const saveLabel = {
    saved: "Saved",
    saving: "Saving…",
    unsaved: "Unsaved changes",
    error: "Couldn't save",
  }[saveStatus];

  if (loading) {
    return (
        <div className="ed-loading-screen">
          <Icon.spinner className="w-8 h-8 text-indigo-600" />
        </div>
    );
  }

  if (pageError) {
    return (
        <div className="ed-error-screen">
          <p className="ed-error-text">{pageError}</p>
          <Link to="/dashboard" className="ed-error-link">Back to dashboard</Link>
        </div>
    );
  }

  return (
      <div className="ed-page">
        {/* ---------- Top bar ---------- */}
        <header className="ed-topbar">
          <div className="ed-topbar-left">
            <button onClick={() => navigate("/dashboard")} className="ed-back-btn" aria-label="Back to dashboard">
              <Icon.back className="w-4 h-4" />
            </button>

            <div className="ed-logo">
              <svg viewBox="0 0 18 18" className="w-4 h-4" fill="none">
                <rect x="1" y="1" width="7" height="7" rx="1.5" fill="white" opacity="0.9" />
                <rect x="10" y="1" width="7" height="7" rx="1.5" fill="white" opacity="0.6" />
                <rect x="1" y="10" width="7" height="7" rx="1.5" fill="white" opacity="0.6" />
                <rect x="10" y="10" width="7" height="7" rx="1.5" fill="white" opacity="0.9" />
              </svg>
            </div>

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
                    onClick={() => { setTitleEditing(true); setTitleDraft(doc?.name || ""); }}
                    className="ed-title-btn"
                    title="Rename document"
                >
                  {doc?.name || "Untitled"}
                </button>
            )}

            <span className="ed-lang-badge">{language}</span>
          </div>

          <div className="ed-topbar-right">
            {/* Save status */}
            <div className="ed-save-status">
              {saveStatus === "saving" && <Icon.spinner className="w-3.5 h-3.5" />}
              {saveStatus === "saved" && <Icon.check className="w-3.5 h-3.5 text-emerald-400" />}
              {saveStatus === "error" && <span className="ed-dot ed-dot-error" />}
              {saveStatus === "unsaved" && <span className="ed-dot ed-dot-unsaved" />}
              <span>{saveLabel}</span>
            </div>

            {/* Collaborator avatars */}
            <div className="ed-avatars">
              {(doc?.collaborators || []).slice(0, 4).map((c, i) => (
                  <div
                      key={c.id || c.username || i}
                      className={`ed-avatar ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}
                      title={c.username || c.name}
                  >
                    {initials(c.username || c.name)}
                  </div>
              ))}
            </div>

            <div className="relative">
              <button onClick={() => setShowMembers((s) => !s)} className="ed-share-btn">
                <Icon.users className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Share</span>
              </button>

              {showMembers && (
                  <div className="ed-share-popover">
                    <div className="ed-share-popover-header">
                      <p className="ed-share-popover-title">Add collaborator</p>
                      <button onClick={() => setShowMembers(false)} className="ed-share-popover-close">
                        <Icon.close className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="ed-share-input-row">
                      <input
                          value={memberUsername}
                          onChange={(e) => { setMemberUsername(e.target.value); setMemberError(""); }}
                          onKeyDown={(e) => e.key === "Enter" && handleAddMember()}
                          placeholder="Username"
                          className="ed-share-input"
                          autoFocus
                      />
                      <button onClick={handleAddMember} disabled={addingMember} className="ed-share-add-btn">
                        {addingMember ? <Icon.spinner className="w-3.5 h-3.5" /> : "Add"}
                      </button>
                    </div>
                    {memberError && <p className="ed-share-error">{memberError}</p>}

                    {doc?.collaborators?.length > 0 && (
                        <div className="ed-share-list">
                          {doc.collaborators.map((c, i) => (
                              <div key={c.id || i} className="ed-share-list-row">
                                <div className={`ed-avatar-sm ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                                  {initials(c.username || c.name)}
                                </div>
                                {c.username || c.name}
                              </div>
                          ))}
                        </div>
                    )}
                  </div>
              )}
            </div>

            <button onClick={handleRun} disabled={running} className="ed-run-btn">
              {running ? <Icon.spinner className="w-3.5 h-3.5" /> : <Icon.play className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{running ? "Running…" : "Run"}</span>
            </button>
          </div>
        </header>

        {/* ---------- Secondary bar: language select (mobile) ---------- */}
        <div className="ed-mobile-langbar">
          <select value={language} onChange={handleLanguageChange} className="ed-select">
            {LANGUAGES.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </div>

        {/* ---------- Body: editor + output ---------- */}
        <div className="ed-body">
          <div className="ed-body-row">
            {/* Language select (desktop, sits as a thin left rail) */}
            <div className="ed-rail">
              <div className="ed-rail-label" style={{ writingMode: "vertical-rl" }}>LANG</div>
            </div>

            <div className="ed-editor-wrap">
              <Editor
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
                  }}
              />
            </div>
          </div>

          {/* ---------- Output / console panel ---------- */}
          <div className={`ed-console ${showOutput ? "ed-console-open" : "ed-console-closed"}`}>
            <button onClick={() => setShowOutput((s) => !s)} className="ed-console-toggle">
                        <span className="ed-console-toggle-left">
                            <Icon.terminal className="w-3.5 h-3.5" />
                            Console
                        </span>
              <Icon.chevron className={`ed-console-chevron ${showOutput ? "ed-console-chevron-open" : ""}`} />
            </button>
            {showOutput && (
                <pre className="ed-console-output">
                            {running ? "Running…" : output || "Run your code to see output here."}
                        </pre>
            )}
          </div>
        </div>

        {/* ---------- Bottom status bar ---------- */}
        <footer className="ed-statusbar">
          <span>Ln {cursorPos.line}, Col {cursorPos.col}</span>
          <div className="ed-statusbar-right">
                    <span className="ed-live-dot">
                        <span className="ed-live-dot-indicator" />
                        Live
                    </span>
            <span className="uppercase font-mono">{language}</span>
          </div>
        </footer>
      </div>
  );
}