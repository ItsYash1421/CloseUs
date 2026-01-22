'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';

export default function DashboardPage() {
    const { token } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            apiClient
                .get('/admin/dashboard/stats', token)
                .then((response) => {
                    setStats(response.data);
                })
                .catch((error) => {
                    console.error('Failed to fetch stats:', error);
                })
                .finally(() => setLoading(false));
        }
    }, [token]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard
                    title="Total Users"
                    value={stats?.users?.total || 0}
                    change={`+${stats?.users?.recent || 0} this week`}
                    icon="👥"
                    color="blue"
                />
                <StatsCard
                    title="Paired Couples"
                    value={stats?.couples?.paired || 0}
                    change={`${stats?.couples?.total || 0} total`}
                    icon="💑"
                    color="pink"
                />
                <StatsCard
                    title="Active Couples"
                    value={stats?.couples?.active || 0}
                    change="Last 7 days"
                    icon="✨"
                    color="green"
                />
                <StatsCard
                    title="Total Messages"
                    value={stats?.messages?.total || 0}
                    change="All time"
                    icon="💬"
                    color="purple"
                />
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card">
                    <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
                    <div className="space-y-3">
                        <StatRow label="Total Questions" value={stats?.questions?.total || 0} />
                        <StatRow label="Unpaired Users" value={stats?.couples?.unpaired || 0} />
                        <StatRow label="Recent Signups" value={stats?.users?.recent || 0} />
                    </div>
                </div>

                <div className="card">
                    <h3 className="text-lg font-semibold mb-4">System Info</h3>
                    <div className="space-y-3">
                        <StatRow label="Server Status" value="Online" isStatus />
                        <StatRow label="Database" value="MongoDB Connected" isStatus />
                        <StatRow label="Version" value="1.0.0" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatsCard({ title, value, change, icon, color }: any) {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        pink: 'bg-pink-50 text-pink-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600',
    };

    return (
        <div className="card">
            <div className="flex items-center justify-between mb-4">
                <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${colorClasses[color as keyof typeof colorClasses]}`}
                >
                    {icon}
                </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600">{title}</h3>
            <p className="text-3xl font-bold text-gray-900 mt-1">{value.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-2">{change}</p>
        </div>
    );
}

function StatRow({ label, value, isStatus = false }: any) {
    return (
        <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">{label}</span>
            <span
                className={`text-sm font-medium ${isStatus ? 'badge badge-success' : 'text-gray-900'}`}
            >
                {value}
            </span>
        </div>
    );
}
