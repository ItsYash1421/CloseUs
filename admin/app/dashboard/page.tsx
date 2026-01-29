'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
} from 'recharts';

export default function DashboardPage() {
    const { token } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (token) {
            fetchStats();
        }
    }, [token]);

    const fetchStats = async () => {
        try {
            const [overviewRes, analyticsRes] = await Promise.all([
                apiClient.get('/admin/dashboard/stats', token!),
                apiClient.get('/admin/analytics/stats', token!),
            ]);

            setStats({
                ...overviewRes.data,
                ...analyticsRes.data,
            });
        } catch (error) {
            console.error('Failed to fetch dashboard stats:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Users"
                    value={stats?.users?.total || 0}
                    icon="👥"
                    color="blue"
                    subtitle={`${stats?.users?.recent || 0} this week`}
                />
                <StatCard
                    title="Active Couples"
                    value={stats?.couples?.active || 0}
                    icon="❤️"
                    color="red"
                    subtitle={`${stats?.couples?.paired || 0} paired total`}
                />
                <StatCard
                    title="Total Messages"
                    value={stats?.messages?.total || 0}
                    icon="💬"
                    color="green"
                    subtitle="All time messages"
                />
                <StatCard
                    title="Questions"
                    value={stats?.questions?.total || 0}
                    icon="❓"
                    color="purple"
                    subtitle="In database"
                />
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">User Stats</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Total Users:</span>
                            <span className="font-bold">{stats?.users?.total || 0}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">New This Week:</span>
                            <span className="font-bold text-green-600">
                                {stats?.users?.recent || 0}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">Couple Stats</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Total Couples:</span>
                            <span className="font-bold">{stats?.couples?.total || 0}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Paired:</span>
                            <span className="font-bold text-green-600">
                                {stats?.couples?.paired || 0}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Unpaired:</span>
                            <span className="font-bold text-yellow-600">
                                {stats?.couples?.unpaired || 0}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Active (7 days):</span>
                            <span className="font-bold text-blue-600">
                                {stats?.couples?.active || 0}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">Content Stats</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Messages:</span>
                            <span className="font-bold">{stats?.messages?.total || 0}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Questions:</span>
                            <span className="font-bold">{stats?.questions?.total || 0}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color, subtitle }: any) {
    const colors: any = {
        blue: 'bg-blue-100 text-blue-600',
        red: 'bg-red-100 text-red-600',
        green: 'bg-green-100 text-green-600',
        purple: 'bg-purple-100 text-purple-600',
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center">
            <div className={`p-3 rounded-full mr-4 ${colors[color]}`}>
                <span className="text-2xl">{icon}</span>
            </div>
            <div>
                <p className="text-sm text-gray-500 font-medium">{title}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
            </div>
        </div>
    );
}
