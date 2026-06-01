import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export const Sidebar = ({ isOpen, onClose, isCollapsed, onToggleCollapse }) => {
    const navigate = useNavigate();
    const [isExpanded, setIsExpanded] = useState(!isCollapsed);

    const menuItems = [
        {
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 4v4m0 0v4m0-4h4m-4 0H9" />
                </svg>
            ),
            label: 'Dashboard',
            href: '/',
        },
        {
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
            ),
            label: 'New Document',
            href: '#',
            action: () => {
                onClose?.();
                navigate('/');
            },
        },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden animate-fade-in"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed lg:static inset-y-16 left-0 z-40 lg:z-auto
                    bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
                    transition-all duration-300 ease-out
                    ${isOpen ? 'w-64 translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    ${isExpanded ? 'lg:w-64' : 'lg:w-20'}
                    overflow-y-auto
                `}
            >
                {/* Header */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
                    <h2 className={`font-semibold text-gray-900 dark:text-white transition-all ${isExpanded ? 'lg:block' : 'lg:hidden'}`}>
                        Menu
                    </h2>
                    <button
                        onClick={onClose}
                        className="lg:hidden p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Menu Items */}
                <nav className="flex-1 px-2 py-4 space-y-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.href}
                            onClick={item.action}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group"
                            title={!isExpanded && item.label}
                        >
                            <div className="flex-shrink-0 text-gray-500 dark:text-gray-400 group-hover:text-primary-500 transition-colors">
                                {item.icon}
                            </div>
                            <span className={`text-sm font-medium transition-all ${isExpanded ? 'lg:inline' : 'lg:hidden'}`}>
                                {item.label}
                            </span>
                        </Link>
                    ))}
                </nav>

                {/* Footer - Toggle */}
                <div className="px-2 py-4 border-t border-gray-200 dark:border-gray-800 hidden lg:block">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="w-full flex items-center justify-center p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        title={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
                    >
                        <svg
                            className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;



