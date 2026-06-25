import "../styles/home.css";

const features = [
    {
        title: "Real-time Sync",
        text: "Every keystroke synced instantly via WebSocket/STOMP. No refresh. No conflicts. Just fluid collaboration across your entire team.",
        icon: (
            <svg viewBox="0 0 22 22" fill="none">
                <path d="M11 2v4M11 16v4M2 11h4M16 11h4M4.93 4.93l2.83 2.83M14.24 14.24l2.83 2.83M4.93 17.07l2.83-2.83M14.24 7.76l2.83-2.83" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
        ),
    },
    {
        title: "Secure Auth",
        text: "JWT-based authentication with Spring Security. Session tokens, refresh flows, and role-based access — secure from login to logout.",
        icon: (
            <svg viewBox="0 0 22 22" fill="none">
                <rect x="5" y="10" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.8"/>
                <path d="M8 10V7a3 3 0 016 0v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                <circle cx="11" cy="14.5" r="1.5" fill="currentColor"/>
            </svg>
        ),
    },
    {
        title: "Multi-language Support",
        text: "Write Java, Python, JavaScript, Go and more. Syntax highlighting and smart indentation adapt to whatever your team is building.",
        icon: (
            <svg viewBox="0 0 22 22" fill="none">
                <polyline points="6 9 2 11 6 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="16 9 20 11 16 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="13" y1="6" x2="9" y2="16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
        ),
    },
    {
        title: "Session Rooms",
        text: "Create private coding rooms, invite teammates with a link, and track who's editing what — powered by Redis Pub/Sub for scale.",
        icon: (
            <svg viewBox="0 0 22 22" fill="none">
                <circle cx="9" cy="7" r="3" stroke="currentColor" strokeWidth="1.8"/>
                <circle cx="17" cy="9" r="2" stroke="currentColor" strokeWidth="1.8"/>
                <path d="M3 18c0-3.31 2.69-6 6-6s6 2.69 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M17 13c1.66 0 3 1.34 3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
        ),
    },
    {
        title: "Version Snapshots",
        text: "Automatically save code snapshots at key moments. Roll back, diff, and restore — like git, but built right into your session.",
        icon: (
            <svg viewBox="0 0 22 22" fill="none">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.8"/>
                <polyline points="11 7 11 11 14 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        ),
    },
    {
        title: "Docker Ready",
        text: "Containerized with Docker Compose — spin up the full Spring Boot + PostgreSQL + Redis stack in one command. Ship with confidence.",
        icon: (
            <svg viewBox="0 0 22 22" fill="none">
                <rect x="2" y="8" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.8"/>
                <path d="M6 8V6a2 2 0 012-2h6a2 2 0 012 2v2" stroke="currentColor" strokeWidth="1.8"/>
                <line x1="6" y1="12" x2="6" y2="14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                <line x1="11" y1="12" x2="11" y2="14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                <line x1="16" y1="12" x2="16" y2="14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
        ),
    },
];

export default function About() {
    return (
        <section className="about" id="about">
            <div className="section-inner">
                <p className="section-eyebrow">Features</p>
                <h2 className="section-headline">Everything your team needs to code, together.</h2>
                <p className="section-sub">
                    Built on battle-tested tech — Spring Boot, WebSocket/STOMP, Redis, and PostgreSQL —
                    so you spend less time on setup and more time shipping.
                </p>

                <div className="about-grid">
                    {features.map((f) => (
                        <div key={f.title} className="about-card">
                            <div className="about-card-icon">{f.icon}</div>
                            <div className="about-card-title">{f.title}</div>
                            <p className="about-card-text">{f.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}