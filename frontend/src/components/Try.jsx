import { Link } from "react-router-dom";
import "../styles/home.css";

const tryCodeLines = [
    { num: 1,  tokens: [{ t: "cm", v: "// WebSocket session handler" }] },
    { num: 2,  tokens: [{ t: "ann", v: "@Component" }] },
    { num: 3,  tokens: [{ t: "kw", v: "public class " }, { t: "cls", v: "SessionService" }, { t: "punc", v: " {" }] },
    { num: 4,  tokens: [] },
    { num: 5,  tokens: [{ t: "kw", v: "  private final " }, { t: "cls", v: "SimpMessagingTemplate" }, { t: "txt", v: " broker;" }] },
    { num: 6,  tokens: [] },
    { num: 7,  tokens: [{ t: "kw", v: "  public void " }, { t: "fn", v: "broadcastChange" }, { t: "punc", v: "(" }, { t: "cls", v: "CodeChangeDTO" }, { t: "txt", v: " dto" }, { t: "punc", v: ") {" }] },
    { num: 8,  tokens: [{ t: "txt", v: "    broker" }, { t: "punc", v: "." }, { t: "fn", v: "convertAndSend" }, { t: "punc", v: "(" }] },
    { num: 9,  tokens: [{ t: "str", v: '      "/topic/session."' }, { t: "punc", v: " + dto" }, { t: "punc", v: "." }, { t: "fn", v: "getSessionId" }, { t: "punc", v: "(), dto);" }], cursor: true },
    { num: 10, tokens: [{ t: "punc", v: "  }" }] },
    { num: 11, tokens: [{ t: "punc", v: "}" }] },
];

function MiniCodeLine({ line }) {
    return (
        <div className={`code-line${line.cursor ? " cursor-line" : ""}`}>
            <span className="line-num">{line.num}</span>
            <span className="line-content">
        {line.tokens.map((tok, i) => (
            <span key={i} className={tok.t}>{tok.v}</span>
        ))}
                {line.cursor && <span className="cursor-caret" />}
      </span>
        </div>
    );
}

const steps = [
    {
        num: "01",
        title: "Create a session",
        text: "Sign up and spin up a new coding session in seconds. Choose your language and invite your team via a shareable link.",
    },
    {
        num: "02",
        title: "Code in real time",
        text: "Everyone edits simultaneously. Changes broadcast instantly over WebSocket — see your teammates' cursors live.",
    },
    {
        num: "03",
        title: "Review and ship",
        text: "Use inline comments, snapshot diffs, and built-in history to review work, then export or push to GitHub.",
    },
];

export default function Try() {
    return (
        <section className="try-section" id="try">
            <div className="try-layout">
                {/* Left: mini editor */}
                <div>
                    <div className="try-mini-editor">
                        <div className="editor-topbar">
                            <div className="editor-dots">
                                <div className="editor-dot red" />
                                <div className="editor-dot yellow" />
                                <div className="editor-dot green" />
                            </div>
                            <div className="editor-tab">SessionService.java</div>
                            <span className="editor-live-badge" style={{ marginLeft: "auto" }}>LIVE</span>
                        </div>
                        <div className="try-mini-code">
                            {tryCodeLines.map((line) => (
                                <MiniCodeLine key={line.num} line={line} />
                            ))}
                        </div>
                    </div>

                    <div className="try-stats">
                        <div className="try-stat">
                            <span className="try-stat-num">{"<"}50ms</span>
                            <span className="try-stat-label">sync latency</span>
                        </div>
                        <div className="try-stat">
                            <span className="try-stat-num">20+</span>
                            <span className="try-stat-label">languages</span>
                        </div>
                        <div className="try-stat">
                            <span className="try-stat-num">∞</span>
                            <span className="try-stat-label">sessions</span>
                        </div>
                    </div>
                </div>

                {/* Right: steps */}
                <div>
                    <p className="section-eyebrow">How it works</p>
                    <h2 className="section-headline">Up and coding in under a minute.</h2>
                    <p className="section-sub">
                        No plugins. No config files. Just open a session and start typing with your team.
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: "28px", marginBottom: "36px" }}>
                        {steps.map((s) => (
                            <div key={s.num} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                                <div style={{
                                    minWidth: "40px", height: "40px",
                                    background: "var(--indigo-light)",
                                    border: "1px solid var(--indigo-mid)",
                                    borderRadius: "var(--radius-md)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontFamily: "var(--font-mono)", fontSize: "12px", fontWeight: "700",
                                    color: "var(--indigo)",
                                }}>
                                    {s.num}
                                </div>
                                <div>
                                    <div style={{ fontSize: "15px", fontWeight: "700", color: "var(--gray-900)", marginBottom: "4px" }}>
                                        {s.title}
                                    </div>
                                    <p style={{ fontSize: "14px", color: "var(--gray-400)", lineHeight: "1.6" }}>{s.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Link to="/signup" className="btn-primary" style={{ display: "inline-flex", padding: "12px 24px", fontSize: "15px", borderRadius: "var(--radius-md)" }}>
                        Try it now — it's free
                    </Link>
                </div>
            </div>
        </section>
    );
}