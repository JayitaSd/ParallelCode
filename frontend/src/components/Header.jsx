import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/header.css";

const LogoIcon = () => (
    <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="7" height="7" rx="1.5" fill="white" opacity="0.9" />
        <rect x="10" y="1" width="7" height="7" rx="1.5" fill="white" opacity="0.6" />
        <rect x="1" y="10" width="7" height="7" rx="1.5" fill="white" opacity="0.6" />
        <rect x="10" y="10" width="7" height="7" rx="1.5" fill="white" opacity="0.9" />
    </svg>
);

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header className={`header${scrolled ? " scrolled" : ""}`}>
            <div className="header-inner">
                <Link to="/" className="header-logo">
                    <div className="header-logo-icon">
                        <LogoIcon />
                    </div>
                    ParallelCode
                </Link>

                <nav className="header-nav">
                    <a href="#about" className="header-nav-link">Features</a>
                    <a href="#try" className="header-nav-link">How it works</a>
                    <a href="#footer" className="header-nav-link">Docs</a>
                    <div className="header-nav-divider" />
                    <Link to="/login" className="btn-ghost">Log in</Link>
                    <Link to="/signup" className="btn-primary">Get started</Link>
                </nav>

                <button
                    className="header-hamburger"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                >
                    <span />
                    <span />
                    <span />
                </button>
            </div>

            <div className={`mobile-nav${mobileOpen ? " open" : ""}`}>
                <a href="#about" onClick={() => setMobileOpen(false)}>Features</a>
                <a href="#try" onClick={() => setMobileOpen(false)}>How it works</a>
                <a href="#footer" onClick={() => setMobileOpen(false)}>Docs</a>
                <Link to="/login" onClick={() => setMobileOpen(false)}>Log in</Link>
                <Link to="/signup" className="btn-primary" onClick={() => setMobileOpen(false)}>
                    Get started free
                </Link>
            </div>
        </header>
    );
}