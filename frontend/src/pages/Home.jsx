import { Link } from 'react-router-dom';
import { Button } from '@/components/Common/Button.jsx';
import { useTheme } from '@/context/ThemeContext.jsx';

const Home = () => {
    const { isDark, toggleTheme } = useTheme();

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 overflow-hidden">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                            P
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">ParallelCode</span>
                    </div>

                    <div className="hidden md:flex items-center gap-10 text-sm font-medium text-gray-600 dark:text-gray-400">
                        <a href="#features" className="hover:text-gray-900 dark:hover:text-white transition-colors">Features</a>
                        <a href="#how" className="hover:text-gray-900 dark:hover:text-white transition-colors">How it Works</a>
                        <a href="#pricing" className="hover:text-gray-900 dark:hover:text-white transition-colors">Pricing</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-xl"
                            title="Toggle Theme"
                        >
                            {isDark ? '☀️' : '🌙'}
                        </button>

                        {/* In the navbar */}
                        <Link to="/auth">
                            <Button variant="outline" size="sm">Log in</Button>
                        </Link>
                        <Link to="/auth?mode=signup">
                            <Button variant="primary" size="sm">Start for Free</Button>
                        </Link>


                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-5xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm px-4 py-1.5 rounded-full mb-6">
                        ⚡ Real-time • Collaborative • Secure
                    </div>

                    <h1 className="text-6xl md:text-7xl font-bold tracking-tighter bg-gradient-to-br from-gray-900 via-blue-700 to-indigo-600 dark:from-white dark:via-blue-400 dark:to-indigo-400 bg-clip-text text-transparent leading-[1.1] mb-8">
                        Great code comes<br />from teamwork
                    </h1>

                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
                        Real-time collaborative code editor. Write, review, and debug together with your team — instantly.
                    </p>

                    {/* In the hero section - replace the buttons div */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {/* In the hero section */}
                        <Link to="/auth?mode=signup">
                            <Button size="lg" className="text-lg px-10 py-7 rounded-2xl font-semibold shadow-xl hover:shadow-2xl">
                                Start Coding Free
                            </Button>
                        </Link>
                        <a href="#demo">
                            <Button variant="outline" size="lg">
                                Watch Demo
                            </Button>
                        </a>
                    </div>
                </div>
            </section>

            {/* Code Preview */}
            <div className="max-w-6xl mx-auto px-6 pb-20">
                <div className="relative rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-2xl bg-gray-900">
                    <div className="bg-gray-800 px-4 py-2 flex items-center gap-2">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <div className="text-xs text-gray-400 mx-auto">index.js — ParallelCode</div>
                    </div>
                    <pre className="p-8 font-mono text-sm text-green-400 bg-black/90 leading-relaxed overflow-auto">
{`// Real-time collaboration in action
const team = ['Alice', 'Bob', 'Charlie'];

team.forEach((dev) => {
  console.log(\`🚀 \${dev} is editing with you\`);
});`}
          </pre>
                </div>
            </div>

            {/* Features */}
            <section id="features" className="py-24 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Built for modern teams</h2>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">Everything you need to code together seamlessly</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Instant Sync",
                                desc: "Changes appear instantly for everyone with WebSocket + Redis",
                                icon: "⚡"
                            },
                            {
                                title: "Monaco Editor",
                                desc: "The same powerful editor used in VS Code",
                                icon: "💻"
                            },
                            {
                                title: "Smart Permissions",
                                desc: "Owner & member controls with secure JWT auth",
                                icon: "🔐"
                            }
                        ].map((feature, i) => (
                            <div key={i} className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 hover:border-blue-500 transition-all">
                                <div className="text-4xl mb-6">{feature.icon}</div>
                                <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 border-t border-gray-200 dark:border-gray-800">
                <div className="max-w-4xl mx-auto text-center px-6">
                    <h2 className="text-5xl font-bold mb-6">Ready to code together?</h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-10">Join thousands of developers building faster with ParallelCode.</p>
                    <Link to="/auth?mode=signup">
                        <Button size="lg" className="text-xl px-12 py-8 rounded-2xl">Get Started — It's Free</Button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;