import { Link } from "react-router-dom";
import "../styles/hero.css";

const codeLines = [
    { num: 1,  tokens: [{ t: "cm", v: "// Real-time collaborative editor" }] },
    { num: 2,  tokens: [] },
    { num: 3,  tokens: [{ t: "ann", v: "@RestController" }] },
    { num: 4,  tokens: [{ t: "kw", v: "public class " }, { t: "cls", v: "EditorController" }, { t: "punc", v: " {" }] },
    { num: 5,  tokens: [] },
    { num: 6,  tokens: [{ t: "ann", v: "  @MessageMapping" }, { t: "punc", v: '(' }, { t: "str", v: '"/code.edit"' }, { t: "punc", v: ")" }] },
    { num: 7,  tokens: [{ t: "kw", v: "  public void " }, { t: "fn", v: "handleEdit" }, { t: "punc", v: "(" }, { t: "cls", v: "CodeChangeDTO" }, { t: "txt", v: " dto" }, { t: "punc", v: ") {" }] },
    { num: 8,  tokens: [{ t: "txt", v: "    sessionService" }, { t: "punc", v: "." }, { t: "fn", v: "broadcastChange" }, { t: "punc", v: "(dto);" }], cursor: true },
    { num: 9,  tokens: [{ t: "punc", v: "  }" }] },
    { num: 10, tokens: [{ t: "punc", v: "}" }] },
];

function CodeLine({ line }) {
    return (
        <div className={`code-line${line.cursor ? " cursor-line" : ""}`}>
            <span className="line-num">{line.num}</span>
            <span className="line-content">
        {line.tokens.map((tok, i) => (
            <span key={i} className={tok.t}>{tok.v}</span>
        ))}
                {line.cursor && <span className="cursor-caret" />}
                {line.collab && (
                    <span className="collab-cursor" style={{ background: "#10b981" }}>
            <span className="collab-cursor-label">Priya</span>
          </span>
                )}
      </span>
        </div>
    );
}

const sidebarFiles = [
    { name: "EditorController.java", active: true },
    { name: "SessionService.java" },
    { name: "WebSocketConfig.java" },
    { name: "CodeChangeDTO.java" },
    { name: "UserSession.java" },
];

const FileIcon = () => (
    <svg viewBox="0 0 16 16" fill="none">
        <path d="M9 2H4a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1V6l-4-4z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
        <path d="M9 2v4h4" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
    </svg>
);

export default function Hero() {
    return (
        <section className="hero">
            <div className="hero-grid-bg" />
            <div className="hero-glow" />

            <div className="hero-content">
                <div className="hero-badge">
                    <span className="hero-badge-dot" />
                    Now in beta — real-time collab for dev teams
                </div>

                <h1 className="hero-headline">
                    Code together,<br />
                    <span className="highlight">in real time.</span>
                </h1>

                <p className="hero-sub">
                    ParallelCode is a collaborative code editor built on Spring Boot and WebSockets —
                    no setup, no lag, just your team and your code.
                </p>

                <div className="hero-actions">
                    <Link to="/signup" className="btn-primary">
                        Start coding free
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </Link>
                    <a href="#try" className="btn-ghost">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
                            <path d="M5.5 5.5L8.5 7l-3 1.5V5.5z" fill="currentColor"/>
                        </svg>
                        See how it works
                    </a>
                </div>
            </div>

            <div className="hero-editor-wrapper">
                <div className="hero-editor-card">
                    <div className="editor-topbar">
                        <div className="editor-dots">
                            <div className="editor-dot red" />
                            <div className="editor-dot yellow" />
                            <div className="editor-dot green" />
                        </div>
                        <div className="editor-tab">
                            <FileIcon />
                            EditorController.java
                        </div>
                        <div className="editor-collab-avatars">
                            <div className="collab-avatar a1">J</div>
                            <div className="collab-avatar a2">P</div>
                            <div className="collab-avatar a3">R</div>
                            <span className="editor-live-badge">LIVE</span>
                        </div>
                    </div>

                    <div className="editor-body">
                        <div className="editor-sidebar">
                            <div className="sidebar-section-label">Explorer</div>
                            {sidebarFiles.map((f) => (
                                <div key={f.name} className={`sidebar-file${f.active ? " active" : ""}`}>
                                    <FileIcon />
                                    {f.name}
                                </div>
                            ))}
                        </div>
                        <div className="editor-code-area">
                            {codeLines.map((line) => (
                                <CodeLine key={line.num} line={line} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}