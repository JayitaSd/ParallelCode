import Header from "../components/Header";
import Hero from "../components/Hero";
import About from "../components/About";
import Try from "../components/Try";
import Footer from "../components/Footer";
import "../styles/home.css";

export default function Home() {
    return (
        <div className="home-wrapper">
            <Header />
            <main className="home-main">
                <Hero />
                <About />
                <Try />
                <Footer />
            </main>
        </div>
    );
}