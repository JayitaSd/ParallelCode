import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

const API_BASE = "http://localhost:8080";

/* ---- Shared logo (same mark used in Login/Home) ---- */
const LogoIcon = () => (
    <svg viewBox="0 0 18 18" fill="none">
      <rect x="1" y="1" width="7" height="7" rx="1.5" fill="white" opacity="0.9" />
      <rect x="10" y="1" width="7" height="7" rx="1.5" fill="white" opacity="0.6" />
      <rect x="1" y="10" width="7" height="7" rx="1.5" fill="white" opacity="0.6" />
      <rect x="10" y="10" width="7" height="7" rx="1.5" fill="white" opacity="0.9" />
    </svg>
);

/* ---- Icons (same stroke style as Login.jsx) ---- */
const PlusIcon = () => (
    <svg viewBox="0 0 16 16" fill="none">
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
);
const TrashIcon = () => (
    <svg viewBox="0 0 16 16" fill="none">
      <path d="M3 4.5h10M6.5 4.5V3a1 1 0 011-1h1a1 1 0 011 1v1.5M4.5 4.5l.6 8.2a1 1 0 001 .9h3.8a1 1 0 001-.9l.6-8.2"
            stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
const UsersIcon = () => (
    <svg viewBox="0 0 16 16" fill="none">
      <circle cx="6" cy="5.5" r="2.2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M1.8 13c0-2.3 1.9-4 4.2-4s4.2 1.7 4.2 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M10.3 4.3c1.1.2 1.9 1.2 1.9 2.4 0 1.1-.7 2-1.7 2.3M12 9.3c1.4.4 2.4 1.6 2.4 3.1"
            stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
);
const LogoutIcon = () => (
    <svg viewBox="0 0 16 16" fill="none">
      <path d="M6 14H3.5A1.5 1.5 0 012 12.5v-9A1.5 1.5 0 013.5 2H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.5 11l3-3-3-3M13.3 8H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
const CodeIcon = () => (
    <svg viewBox="0 0 16 16" fill="none">
      <path d="M5.5 4L2 8l3.5 4M10.5 4L14 8l-3.5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
const AlertIcon = () => (
    <svg viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8 5v3.5M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);
const CloseIcon = () => (
    <svg viewBox="0 0 16 16" fill="none">
      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

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

function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [docName, setDocName] = useState("");
  const [docLanguage, setDocLanguage] = useState("javascript");
  const [createError, setCreateError] = useState("");
  const [creating, setCreating] = useState(false);

  const [addingMemberId, setAddingMemberId] = useState(null);
  const [memberUsername, setMemberUsername] = useState("");
  const [memberError, setMemberError] = useState("");
  const [addingMember, setAddingMember] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }

    setUser({ username: localStorage.getItem("username") });
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    setPageError("");
    try {
      const res = await fetch(`${API_BASE}/documents`, { headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load documents.");
      setDocuments(Array.isArray(data) ? data : data.documents || []);
    } catch (err) {
      setPageError(err.message || "Failed to load documents.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  /* ---- Create document ---- */
  const openCreateModal = () => {
    setDocName("");
    setDocLanguage("javascript");
    setCreateError("");
    setShowCreateModal(true);
  };

  const handleCreateDocument = async () => {
    if (!docName.trim()) {
      setCreateError("Document name is required.");
      return;
    }
    setCreating(true);
    setCreateError("");
    try {
      const res = await fetch(`${API_BASE}/documents/create`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ title: docName.trim(), language: docLanguage }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create document.");
      setDocuments((prev) => [data, ...prev]);
      setShowCreateModal(false);
    } catch (err) {
      setCreateError(err.message || "Failed to create document.");
    } finally {
      setCreating(false);
    }
  };

  /* ---- Delete document ---- */
  const handleDeleteDocument = async (doc) => {
    if (!window.confirm(`Delete "${doc.title}"? This cannot be undone.`)) return;
    setDeletingId(doc.id);
    try {
      const res = await fetch(`${API_BASE}/documents/${doc.id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to delete document.");
      }
      setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
    } catch (err) {
      setPageError(err.message || "Failed to delete document.");
    } finally {
      setDeletingId(null);
    }
  };

  /* ---- Add collaborator ---- */
  const openAddMember = (docId) => {
    setAddingMemberId(addingMemberId === docId ? null : docId);
    setMemberUsername("");
    setMemberError("");
  };

  const handleAddMember = async (docId) => {
    if (!memberUsername.trim()) { setMemberError("Enter a username."); return; }
    setAddingMember(true);
    setMemberError("");
    try {
      // ✅ username as query param, no body needed
      const res = await fetch(
          `${API_BASE}/documents/${docId}/members?username=${encodeURIComponent(memberUsername.trim())}`,
          {
            method: "POST",
            headers: authHeaders(),
            // ✅ no body
          }
      );

      // ✅ backend returns plain text, not JSON
      const text = await res.text();
      if (!res.ok) throw new Error(text || "Could not add that user.");

      // ✅ optimistically add to local state
      setDocuments((prev) =>
          prev.map((d) =>
              d.id === docId
                  ? { ...d, collaborators: [...(d.collaborators || []), { username: memberUsername.trim() }] }
                  : d
          )
      );
      setAddingMemberId(null);
      setMemberUsername("");
    } catch (err) {
      setMemberError(err.message || "Could not add that user.");
    } finally {
      setAddingMember(false);
    }
  };
  const initials = (name) => (name || "U").trim()[0]?.toUpperCase() || "U";

  return (
      <div className="dash-page">
        {/* ---------- Header ---------- */}
        <header className="dash-header">
          <div className="dash-header-inner">
            <Link to="/" className="dash-logo">
              <div className="dash-logo-icon"><LogoIcon /></div>
              ParallelCode
            </Link>

            <div className="dash-header-right">
              <div className="dash-user">
                <div className="dash-user-avatar">{initials(user?.username)}</div>
                <span className="dash-user-name">{user?.username || "My account"}</span>
              </div>
              <button className="dash-logout-btn" onClick={handleLogout}>
                <LogoutIcon />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* ---------- Main ---------- */}
        <main className="dash-main">
          <div className="dash-toolbar">
            <div>
              <h1 className="dash-title">My documents</h1>
              <p className="dash-subtitle">Create, share and manage your collaborative code documents.</p>
            </div>
            <button className="dash-new-btn" onClick={openCreateModal}>
              <PlusIcon />
              New document
            </button>
          </div>

          {pageError && (
              <div className="dash-alert error">
                <AlertIcon />
                {pageError}
              </div>
          )}

          {loading ? (
              <div className="dash-loading">
                <span className="spinner-lg" />
              </div>
          ) : documents.length === 0 ? (
              <div className="dash-empty">
                <div className="dash-empty-icon"><CodeIcon /></div>
                <h3>No documents yet</h3>
                <p>Start your first collaborative document to see it here.</p>
                <button className="dash-new-btn" onClick={openCreateModal}>
                  <PlusIcon />
                  New document
                </button>
              </div>
          ) : (
              <div className="dash-grid">
                {documents.map((doc) => (
                    <div className="dash-card" key={doc.id}>
                      <div className="dash-card-top">
                        <div className="dash-card-title-wrap">
                          <h3 className="dash-card-title">{doc.title}</h3>
                          <span className="dash-lang-badge">{doc.language}</span>
                        </div>
                        <button
                            className="dash-icon-btn danger"
                            title="Delete document"
                            onClick={() => handleDeleteDocument(doc)}
                            disabled={deletingId === doc.id}
                        >
                          {deletingId === doc.id ? <span className="spinner" /> : <TrashIcon />}
                        </button>
                      </div>

                      <div className="dash-collab-section">
                        <div className="dash-collab-label">
                          <UsersIcon />
                          Collaborators
                        </div>
                        <div className="dash-collab-list">
                          {doc.collaborators && doc.collaborators.length > 0 ? (
                              doc.collaborators.map((c, i) => (
                                  <span className="dash-collab-chip" key={c.id || c.username || i}>
                                                    {initials(c.username || c.name)} {c.username || c.name}
                                                </span>
                              ))
                          ) : (
                              <span className="dash-collab-empty">Only you</span>
                          )}
                        </div>
                      </div>

                      <div className="dash-card-actions">
                        <Link to={`/editor/${doc.id}`} className="dash-open-btn">Open editor</Link>
                        <button className="dash-add-btn" onClick={() => openAddMember(doc.id)}>
                          <PlusIcon />
                          Add member
                        </button>
                      </div>

                      {addingMemberId === doc.id && (
                          <div className="dash-add-form">
                            <input
                                className="dash-add-input"
                                placeholder="Username"
                                value={memberUsername}
                                onChange={(e) => { setMemberUsername(e.target.value); setMemberError(""); }}
                                onKeyDown={(e) => e.key === "Enter" && handleAddMember(doc.id)}
                                autoFocus
                            />
                            <button
                                className="dash-add-confirm-btn"
                                onClick={() => handleAddMember(doc.id)}
                                disabled={addingMember}
                            >
                              {addingMember ? <span className="spinner" /> : "Add"}
                            </button>
                            <button className="dash-icon-btn" onClick={() => setAddingMemberId(null)}>
                              <CloseIcon />
                            </button>
                          </div>
                      )}
                      {addingMemberId === doc.id && memberError && (
                          <span className="form-error-msg">{memberError}</span>
                      )}
                    </div>
                ))}
              </div>
          )}
        </main>

        {/* ---------- Create document modal ---------- */}
        {showCreateModal && (
            <div className="dash-modal-overlay" onClick={() => setShowCreateModal(false)}>
              <div className="dash-modal" onClick={(e) => e.stopPropagation()}>
                <div className="dash-modal-header">
                  <h2>New document</h2>
                  <button className="dash-icon-btn" onClick={() => setShowCreateModal(false)}>
                    <CloseIcon />
                  </button>
                </div>

                {createError && (
                    <div className="dash-alert error">
                      <AlertIcon />
                      {createError}
                    </div>
                )}

                <div className="form-group">
                  <label className="form-label">Document name</label>
                  <input
                      className="form-input dash-modal-input"
                      placeholder="e.g. Team API Backend"
                      value={docName}
                      onChange={(e) => { setDocName(e.target.value); setCreateError(""); }}
                      onKeyDown={(e) => e.key === "Enter" && handleCreateDocument()}
                      autoFocus
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Language</label>
                  <select
                      className="dash-select"
                      value={docLanguage}
                      onChange={(e) => setDocLanguage(e.target.value)}
                  >
                    {LANGUAGES.map((l) => (
                        <option key={l.value} value={l.value}>{l.label}</option>
                    ))}
                  </select>
                </div>

                <div className="dash-modal-actions">
                  <button className="btn-ghost" onClick={() => setShowCreateModal(false)}>Cancel</button>
                  <button className="dash-new-btn" onClick={handleCreateDocument} disabled={creating}>
                    {creating ? <span className="spinner" /> : <PlusIcon />}
                    {creating ? "Creating…" : "Create document"}
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}