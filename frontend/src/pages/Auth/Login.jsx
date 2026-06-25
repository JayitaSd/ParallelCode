import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/auth.css";

/* ---- Shared logo ---- */
const LogoIcon = () => (
    <svg viewBox="0 0 18 18" fill="none">
        <rect x="1" y="1" width="7" height="7" rx="1.5" fill="white" opacity="0.9" />
        <rect x="10" y="1" width="7" height="7" rx="1.5" fill="white" opacity="0.6" />
        <rect x="1" y="10" width="7" height="7" rx="1.5" fill="white" opacity="0.6" />
        <rect x="10" y="10" width="7" height="7" rx="1.5" fill="white" opacity="0.9" />
    </svg>
);

/* ---- Code preview data ---- */
const codeLines = [
    { num: 1,  tokens: [{ t: "ann", v: "@SpringBootApplication" }] },
    { num: 2,  tokens: [{ t: "kw", v: "public class " }, { t: "cls", v: "ParallelCodeApp" }, { t: "punc", v: " {" }] },
    { num: 3,  tokens: [] },
    { num: 4,  tokens: [{ t: "kw", v: "  public static void " }, { t: "fn", v: "main" }, { t: "punc", v: "(String[] args) {" }] },
    { num: 5,  tokens: [{ t: "cls", v: "    SpringApplication" }, { t: "punc", v: "." }, { t: "fn", v: "run" }, { t: "punc", v: "(" }, { t: "cls", v: "ParallelCodeApp" }, { t: "punc", v: ".class, args);" }] },
    { num: 6,  tokens: [{ t: "punc", v: "  }" }] },
    { num: 7,  tokens: [{ t: "punc", v: "}" }] },
    { num: 8,  tokens: [] },
    { num: 9,  tokens: [{ t: "cm", v: "// WebSocket session active" }] },
    { num: 10, tokens: [{ t: "cm", v: "// 3 collaborators connected" }], cursor: true },
];

function MiniLine({ line }) {
    return (
        <div className={`code-line${line.cursor ? " cursor-line" : ""}`}>
            <span className="line-num">{line.num}</span>
            <span className="line-content">
        {line.tokens.map((tok, i) => <span key={i} className={tok.t}>{tok.v}</span>)}
                {line.cursor && <span className="cursor-caret" />}
      </span>
        </div>
    );
}

const collabRows = [
    { name: "Priya K.", action: "Editing SessionService.java", color: "green", initial: "P" },
    { name: "Rohan M.", action: "Reviewing AuthController.java", color: "purple", initial: "R" },
    { name: "Anya S.", action: "Joined 2 min ago", color: "amber", initial: "A" },
];

/* ---- Icons ---- */
const UserIcon = () => (
    <svg viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M2 14c0-3.31 2.69-6 6-6s6 2.69 6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
);
const LockIcon = () => (
    <svg viewBox="0 0 16 16" fill="none">
        <rect x="3" y="7.5" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M5.5 7.5V5a2.5 2.5 0 015 0v2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <circle cx="8" cy="11" r="1" fill="currentColor"/>
    </svg>
);
const EyeIcon = ({ off }) => off ? (
    <svg viewBox="0 0 16 16" fill="none">
        <path d="M2 2l12 12M6.5 6.6A3 3 0 0111.4 11.4M4.1 4.1C2.8 5.1 2 6.5 2 8c0 3 2.7 5.5 6 5.5 1.3 0 2.5-.4 3.4-1.1M7 3.6C7.3 3.5 7.6 3.5 8 3.5c3.3 0 6 2.5 6 5.5 0 .9-.2 1.7-.6 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
) : (
    <svg viewBox="0 0 16 16" fill="none">
        <path d="M2 8c0-3 2.7-5.5 6-5.5S14 5 14 8s-2.7 5.5-6 5.5S2 11 2 8z" stroke="currentColor" strokeWidth="1.4"/>
        <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/>
    </svg>
);

const AlertIcon = () => (
    <svg viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M8 5v3.5M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
);

/* ---- Component ---- */
export default function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ usernameOrEmail: "", password: "" });
    const [showPw, setShowPw] = useState(false);
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState("");
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const e = {};
        if (!form.usernameOrEmail.trim()) e.usernameOrEmail = "Username or email is required.";
        if (!form.password) e.password = "Password is required.";
        return e;
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
        setApiError("");
    };

    const handleSubmit = async () => {
        const e = validate();
        if (Object.keys(e).length) { setErrors(e); return; }
        setLoading(true);
        try {
            const res = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ usernameOrEmail: form.usernameOrEmail, password: form.password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Login failed.");
            localStorage.setItem("token", data.token);
            navigate("/dashboard");
        } catch (err) {
            setApiError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            {/* Left: Editor panel */}
            <div className="auth-left">
                <div className="auth-left-overlay" />
                <div className="auth-left-inner">
                    <Link to="/" className="auth-left-logo">
                        <div className="auth-left-logo-icon"><LogoIcon /></div>
                        ParallelCode
                    </Link>

                    <div>
                        <div className="auth-editor-preview">
                            <div className="auth-editor-topbar">
                                <div className="editor-dots">
                                    <div className="editor-dot red" />
                                    <div className="editor-dot yellow" />
                                    <div className="editor-dot green" />
                                </div>
                                <div className="editor-tab" style={{ fontSize: "11px" }}>ParallelCodeApp.java</div>
                                <span className="editor-live-badge" style={{ marginLeft: "auto" }}>LIVE</span>
                            </div>
                            <div className="auth-editor-code">
                                {codeLines.map((l) => <MiniLine key={l.num} line={l} />)}
                            </div>
                        </div>

                        <div className="auth-collab-info">
                            {collabRows.map((r) => (
                                <div key={r.name} className="auth-collab-row">
                                    <div className={`auth-collab-avatar ${r.color}`}>{r.initial}</div>
                                    <div className="auth-collab-text">
                                        <div className="auth-collab-name">{r.name}</div>
                                        <div className="auth-collab-action">{r.action}</div>
                                    </div>
                                    <div className="auth-collab-dot" />
                                </div>
                            ))}
                        </div>

                        <div className="auth-left-quote">
                            <p>"Real-time collaboration that just works — no lag, no conflicts."</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Login form */}
            <div className="auth-right">
                <div className="auth-form-box">
                    <div className="auth-form-header">
                        <h1 className="auth-form-title">Welcome back</h1>
                        <p className="auth-form-sub">
                            Don't have an account? <Link to="/signup">Sign up free</Link>
                        </p>
                    </div>

                    {apiError && (
                        <div className="auth-alert error">
                            <AlertIcon />
                            {apiError}
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">Username or email</label>
                        <div className="form-input-wrap">
                            <UserIcon />
                            <input
                                className={`form-input${errors.usernameOrEmail ? " error" : ""}`}
                                type="text"
                                name="usernameOrEmail"
                                placeholder="you@example.com"
                                value={form.usernameOrEmail}
                                onChange={handleChange}
                                autoComplete="username"
                            />
                        </div>
                        {errors.usernameOrEmail && <span className="form-error-msg">{errors.usernameOrEmail}</span>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div className="form-input-wrap">
                            <LockIcon />
                            <input
                                className={`form-input${errors.password ? " error" : ""}`}
                                type={showPw ? "text" : "password"}
                                name="password"
                                placeholder="Enter your password"
                                value={form.password}
                                onChange={handleChange}
                                autoComplete="current-password"
                                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                            />
                            <button className="form-password-toggle" onClick={() => setShowPw(!showPw)} type="button" aria-label="Toggle password">
                                <EyeIcon off={showPw} />
                            </button>
                        </div>
                        {errors.password && <span className="form-error-msg">{errors.password}</span>}
                    </div>

                    <div className="form-extras">
                        <label className="form-remember">
                            <input type="checkbox" />
                            Remember me
                        </label>
                        <a href="#" className="form-forgot">Forgot password?</a>
                    </div>

                    <button
                        className="auth-submit-btn"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? <span className="spinner" /> : null}
                        {loading ? "Signing in…" : "Sign in"}
                    </button>

                    <p className="auth-switch">
                        New to ParallelCode? <Link to="/signup">Create an account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}