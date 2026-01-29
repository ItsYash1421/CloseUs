'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const { admin, logout } = useAuth();

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: '📊' },
        { name: 'Users', href: '/dashboard/users', icon: '👥' },
        { name: 'Couples', href: '/dashboard/couples', icon: '💑' },
        { name: 'Questions', href: '/dashboard/questions', icon: '❓' },
        { name: 'Games', href: '/dashboard/games', icon: '🎮' },
        { name: 'Notifications', href: '/dashboard/notifications', icon: '🔔' },
        { name: 'Features', href: '/dashboard/features', icon: '🏷️' },
        { name: 'Campaigns', href: '/dashboard/campaigns', icon: '📣' },
        { name: 'Promotions', href: '/dashboard/promotions', icon: '🎟️' },
    ];

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-xl font-bold text-gray-900">CloseUs Admin</h1>
                </div>

                <nav className="p-4 space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                    isActive
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <span className="mr-3 text-lg">{item.icon}</span>
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-900">{admin?.name}</p>
                            <p className="text-xs text-gray-500">{admin?.role}</p>
                        </div>
                        <button
                            onClick={logout}
                            className="text-gray-400 hover:text-gray-600"
                            title="Logout"
                        >
                            🚪
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="p-8">{children}</div>
            </main>
        </div>
    );
}
