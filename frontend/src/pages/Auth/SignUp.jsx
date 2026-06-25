import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/auth.css";

/* ---- Logo ---- */
const LogoIcon = () => (
    <svg viewBox="0 0 18 18" fill="none">
        <rect x="1" y="1" width="7" height="7" rx="1.5" fill="white" opacity="0.9" />
        <rect x="10" y="1" width="7" height="7" rx="1.5" fill="white" opacity="0.6" />
        <rect x="1" y="10" width="7" height="7" rx="1.5" fill="white" opacity="0.6" />
        <rect x="10" y="10" width="7" height="7" rx="1.5" fill="white" opacity="0.9" />
    </svg>
);

/* ---- Code preview ---- */
const codeLines = [
    { num: 1,  tokens: [{ t: "ann", v: "@Configuration" }] },
    { num: 2,  tokens: [{ t: "kw", v: "public class " }, { t: "cls", v: "WebSocketConfig" }, { t: "kw", v: " implements " }, { t: "cls", v: "WebSocketMessageBrokerConfigurer" }, { t: "punc", v: " {" }] },
    { num: 3,  tokens: [] },
    { num: 4,  tokens: [{ t: "ann", v: "  @Override" }] },
    { num: 5,  tokens: [{ t: "kw", v: "  public void " }, { t: "fn", v: "registerStompEndpoints" }, { t: "punc", v: "(" }, { t: "cls", v: "StompEndpointRegistry" }, { t: "txt", v: " reg" }, { t: "punc", v: ") {" }] },
    { num: 6,  tokens: [{ t: "txt", v: "    reg" }, { t: "punc", v: "." }, { t: "fn", v: "addEndpoint" }, { t: "punc", v: "(" }, { t: "str", v: '"/ws"' }, { t: "punc", v: ")." }, { t: "fn", v: "withSockJS" }, { t: "punc", v: "();" }] },
    { num: 7,  tokens: [{ t: "punc", v: "  }" }] },
    { num: 8,  tokens: [] },
    { num: 9,  tokens: [{ t: "ann", v: "  @Override" }] },
    { num: 10, tokens: [{ t: "kw", v: "  public void " }, { t: "fn", v: "configureMessageBroker" }, { t: "punc", v: "(" }, { t: "cls", v: "MessageBrokerRegistry" }, { t: "txt", v: " config" }, { t: "punc", v: ") {" }] },
    { num: 11, tokens: [{ t: "txt", v: "    config" }, { t: "punc", v: "." }, { t: "fn", v: "enableSimpleBroker" }, { t: "punc", v: "(" }, { t: "str", v: '"/topic"' }, { t: "punc", v: ");" }], cursor: true },
    { num: 12, tokens: [{ t: "punc", v: "  }" }] },
    { num: 13, tokens: [{ t: "punc", v: "}" }] },
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
    { name: "Arnav D.", action: "Reviewing WebSocketConfig.java", color: "green", initial: "A" },
    { name: "Siya T.", action: "Editing SessionService.java", color: "purple", initial: "S" },
];

/* ---- Icons ---- */
const MailIcon = () => (
    <svg viewBox="0 0 16 16" fill="none">
        <rect x="1.5" y="3.5" width="13" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M1.5 5.5l6.5 4 6.5-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
);
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
const CheckIcon = () => (
    <svg viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M5 8.5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
const AlertIcon = () => (
    <svg viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M8 5v3.5M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
);

/* ---- Password strength helper ---- */
function getStrength(pw) {
    if (!pw) return { score: 0, label: "", cls: "" };
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 1) return { score, label: "Weak", cls: "weak" };
    if (score <= 2) return { score, label: "Fair", cls: "fair" };
    return { score, label: "Strong", cls: "strong" };
}

/* ---- Component ---- */
export default function Signup() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", username: "", password: "" });
    const [showPw, setShowPw] = useState(false);
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const strength = getStrength(form.password);

    const validate = () => {
        const e = {};
        if (!form.email.trim()) e.email = "Email is required.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email.";
        if (!form.username.trim()) e.username = "Username is required.";
        else if (form.username.length < 3) e.username = "Username must be at least 3 characters.";
        if (!form.password) e.password = "Password is required.";
        else if (form.password.length < 8) e.password = "Password must be at least 8 characters.";
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
            const res = await fetch("http://localhost:8080/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: form.email, username: form.username, password: form.password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Signup failed.");
            setSuccess(true);
            setTimeout(() => navigate("/login"), 1800);
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
                                <div className="editor-tab" style={{ fontSize: "11px" }}>WebSocketConfig.java</div>
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
                            <p>"We shipped our MVP 2x faster because everyone could code in the same file at the same time."</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Signup form */}
            <div className="auth-right">
                <div className="auth-form-box">
                    <div className="auth-form-header">
                        <h1 className="auth-form-title">Create your account</h1>
                        <p className="auth-form-sub">
                            Already have one? <Link to="/login">Sign in</Link>
                        </p>
                    </div>

                    {apiError && (
                        <div className="auth-alert error">
                            <AlertIcon />
                            {apiError}
                        </div>
                    )}

                    {success && (
                        <div className="auth-alert success">
                            <CheckIcon />
                            Account created! Redirecting you to login…
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <div className="form-input-wrap">
                            <MailIcon />
                            <input
                                className={`form-input${errors.email ? " error" : ""}`}
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={handleChange}
                                autoComplete="email"
                            />
                        </div>
                        {errors.email && <span className="form-error-msg">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <div className="form-input-wrap">
                            <UserIcon />
                            <input
                                className={`form-input${errors.username ? " error" : ""}`}
                                type="text"
                                name="username"
                                placeholder="jayita_dev"
                                value={form.username}
                                onChange={handleChange}
                                autoComplete="username"
                            />
                        </div>
                        {errors.username && <span className="form-error-msg">{errors.username}</span>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div className="form-input-wrap">
                            <LockIcon />
                            <input
                                className={`form-input${errors.password ? " error" : ""}`}
                                type={showPw ? "text" : "password"}
                                name="password"
                                placeholder="At least 8 characters"
                                value={form.password}
                                onChange={handleChange}
                                autoComplete="new-password"
                                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                            />
                            <button className="form-password-toggle" onClick={() => setShowPw(!showPw)} type="button" aria-label="Toggle password">
                                <EyeIcon off={showPw} />
                            </button>
                        </div>
                        {errors.password && <span className="form-error-msg">{errors.password}</span>}
                        {form.password && (
                            <div className="pw-strength">
                                <div className="pw-strength-bars">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div
                                            key={i}
                                            className={`pw-strength-bar${i <= strength.score ? ` active ${strength.cls}` : ""}`}
                                        />
                                    ))}
                                </div>
                                <span className="pw-strength-label">{strength.label} password</span>
                            </div>
                        )}
                    </div>

                    <button
                        className="auth-submit-btn"
                        onClick={handleSubmit}
                        disabled={loading || success}
                        style={{ marginTop: "8px" }}
                    >
                        {loading ? <span className="spinner" /> : null}
                        {loading ? "Creating account…" : "Create account"}
                    </button>

                    <p className="auth-switch" style={{ fontSize: "12px", marginTop: "12px" }}>
                        By signing up, you agree to our{" "}
                        <a href="#" style={{ color: "var(--gray-400)" }}>Terms</a> and{" "}
                        <a href="#" style={{ color: "var(--gray-400)" }}>Privacy Policy</a>.
                    </p>
                </div>
            </div>
        </div>
    );
}