import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth.js';
import { useTheme } from '@/context/ThemeContext.jsx';
import { LoginForm } from './LoginForm.jsx';
import { SignupForm } from './SignupForm.jsx';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Handle ?mode=signup
  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'signup') setIsLogin(false);
  }, [searchParams]);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Consistent Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                P
              </div>
              <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">ParallelCode</span>
            </div>

            <div className="flex items-center gap-4">
              <button
                  onClick={toggleTheme}
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-xl"
              >
                {isDark ? '☀️' : '🌙'}
              </button>
              <a href="/" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                Home
              </a>
            </div>
          </div>
        </nav>

        <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

              {/* Code Preview - Top on Mobile, Left on Desktop */}
              <div className="order-1 lg:order-1 flex flex-col justify-center">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  <div className="absolute -inset-4 bg-blue-500/10 dark:bg-blue-500/20 rounded-[3rem] blur-3xl" />

                  <div className="bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-700 relative">
                    <div className="bg-gray-800 px-4 py-3 flex items-center gap-2 border-b border-gray-700">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                      </div>
                      <div className="text-xs text-gray-400 mx-auto font-medium">collab.js — Live Session</div>
                    </div>
                    <pre className="p-6 sm:p-8 font-mono text-xs sm:text-sm text-emerald-400 bg-black/95 leading-relaxed h-[380px] overflow-auto">
{`// Real-time collaboration in action
const team = ['Alice', 'Bob', 'Charlie'];

team.forEach((dev) => {
  console.log(\`🚀 \${dev} joined the room\`);
});

// Changes appear instantly for everyone
socket.on('code-update', (newCode) => {
  editor.setValue(newCode);
});`}
                  </pre>
                  </div>
                </div>

                <div className="text-center mt-6 lg:mt-8">
                  <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
                    Code together.<br />Ship faster.
                  </p>
                </div>
              </div>

              {/* Auth Form - Bottom on Mobile, Right on Desktop */}
              <div className="order-2 lg:order-2 flex justify-center">
                <div className="w-full max-w-md">
                  <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-10 text-center">
                      <div className="mx-auto w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                        <span className="text-4xl font-bold text-white">P</span>
                      </div>
                      <h2 className="text-3xl font-bold text-white mb-2">
                        {isLogin ? 'Welcome Back' : 'Get Started'}
                      </h2>
                      <p className="text-blue-100 text-sm">
                        {isLogin
                            ? 'Sign in to continue coding'
                            : 'Create your account and start collaborating'}
                      </p>
                    </div>

                    {/* Form */}
                    <div className="p-8">
                      {isLogin ? (
                          <LoginForm onSwitchToSignup={() => setIsLogin(false)} />
                      ) : (
                          <SignupForm onSwitchToLogin={() => setIsLogin(true)} />
                      )}
                    </div>
                  </div>

                  <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6">
                    Secure • Encrypted • Real-time
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default AuthPage;