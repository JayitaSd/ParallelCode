import { Link } from "react-router-dom";
import "../styles/home.css";

const LogoIcon = () => (
    <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="7" height="7" rx="1.5" fill="white" opacity="0.9" />
        <rect x="10" y="1" width="7" height="7" rx="1.5" fill="white" opacity="0.6" />
        <rect x="1" y="10" width="7" height="7" rx="1.5" fill="white" opacity="0.6" />
        <rect x="10" y="10" width="7" height="7" rx="1.5" fill="white" opacity="0.9" />
    </svg>
);

export default function Footer() {
    return (
        <footer className="footer" id="footer">
            <div className="footer-inner">
                <div className="footer-top">
                    <div>
                        <div className="footer-brand">
                            <div className="footer-brand-icon"><LogoIcon /></div>
                            ParallelCode
                        </div>
                        <p className="footer-tagline">
                            Real-time collaborative coding for dev teams. Built with Spring Boot, WebSockets, and Redis.
                        </p>
                    </div>

                    <div>
                        <div className="footer-col-title">Product</div>
                        <div className="footer-col-links">
                            <a href="#about">Features</a>
                            <a href="#try">How it works</a>
                            <Link to="/signup">Get started</Link>
                            <a href="#">Changelog</a>
                        </div>
                    </div>

                    <div>
                        <div className="footer-col-title">Developers</div>
                        <div className="footer-col-links">
                            <a href="#">API Docs</a>
                            <a href="#">WebSocket Guide</a>
                            <a href="#">Spring Boot Setup</a>
                            <a href="https://github.com/JayitaSd" target="_blank" rel="noreferrer">GitHub</a>
                        </div>
                    </div>

                    <div>
                        <div className="footer-col-title">Connect</div>
                        <div className="footer-col-links">
                            <a href="mailto:jayita.sadani.work@gmail.com">Contact</a>
                            <a href="https://linkedin.com/in/jayita-sadani" target="_blank" rel="noreferrer">LinkedIn</a>
                            <a href="#">Twitter</a>
                            <a href="#">Discord</a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <span>© 2025 ParallelCode. Built with Spring Boot + React.</span>
                    <div className="footer-bottom-links">
                        <a href="#">Privacy</a>
                        <a href="#">Terms</a>
                        <a href="#">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}