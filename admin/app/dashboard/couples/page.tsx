'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { LayoutGrid, Table as TableIcon, Heart, Calendar, Clock } from 'lucide-react';

type ViewMode = 'table' | 'card';

export default function CouplesPage() {
    const { token } = useAuth();
    const [couples, setCouples] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [viewMode, setViewMode] = useState<ViewMode>('table');

    // Load view preference from localStorage
    useEffect(() => {
        const savedView = localStorage.getItem('couples-view-mode') as ViewMode;
        if (savedView === 'table' || savedView === 'card') {
            setViewMode(savedView);
        }
    }, []);

    useEffect(() => {
        fetchCouples();
    }, [token, page]);

    const fetchCouples = async () => {
        if (!token) return;

        setLoading(true);
        try {
            setError(null);
            const response = await apiClient.get(
                `/admin/dashboard/couples?page=${page}&limit=20`,
                token
            );
            setCouples(response.data.couples);
            setTotalPages(response.data.pagination.pages);
        } catch (err) {
            console.error('Failed to fetch couples:', err);
            setError('Failed to load data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const toggleViewMode = (mode: ViewMode) => {
        setViewMode(mode);
        localStorage.setItem('couples-view-mode', mode);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div>
            {error && (
                <div className="bg-red-50 border border-red-200 text-center rounded-lg py-8 mb-6">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button onClick={fetchCouples} className="btn-primary">Retry</button>
                </div>
            )}

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Couples Management</h1>

                {/* View Toggle */}
                <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => toggleViewMode('table')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                            viewMode === 'table'
                                ? 'bg-white shadow-sm text-blue-600 font-medium'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        <TableIcon size={18} />
                        <span className="text-sm">Table</span>
                    </button>
                    <button
                        onClick={() => toggleViewMode('card')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                            viewMode === 'card'
                                ? 'bg-white shadow-sm text-blue-600 font-medium'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        <LayoutGrid size={18} />
                        <span className="text-sm">Cards</span>
                    </button>
                </div>
            </div>

            {/* Couples Table View */}
            {viewMode === 'table' && (
                <div className="card overflow-x-auto">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Partner 1</th>
                                        <th>Partner 2</th>
                                        <th>Couple Tag</th>
                                        <th>Status</th>
                                        <th>Anniversary</th>
                                        <th>Created</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {couples.map((couple) => (
                                        <tr key={couple._id}>
                                            <td className="font-medium">
                                                {couple.partner1Id?.name || 'N/A'}
                                            </td>
                                            <td className="font-medium">
                                                {couple.partner2Id?.name || 'Pending'}
                                            </td>
                                            <td>
                                                {couple.coupleTag ? (
                                                    <span className="text-pink-600 font-semibold">
                                                        {couple.coupleTag}
                                                    </span>
                                                ) : (
                                                    '-'
                                                )}
                                            </td>
                                            <td>
                                                {couple.isPaired ? (
                                                    <span className="badge badge-success">
                                                        Paired
                                                    </span>
                                                ) : (
                                                    <span className="badge badge-warning">
                                                        Pending
                                                    </span>
                                                )}
                                            </td>
                                            <td className="text-gray-600">
                                                {couple.anniversaryDate
                                                    ? formatDate(couple.anniversaryDate)
                                                    : '-'}
                                            </td>
                                            <td className="text-gray-500">
                                                {formatDate(couple.createdAt)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Pagination */}
                            <div className="flex justify-between items-center mt-6 pt-4 border-t">
                                <p className="text-sm text-gray-600">
                                    Page {page} of {totalPages}
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setPage(page - 1)}
                                        disabled={page === 1}
                                        className="btn-secondary disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setPage(page + 1)}
                                        disabled={page === totalPages}
                                        className="btn-secondary disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Couples Card View */}
            {viewMode === 'card' && (
                <div>
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <>
                            <div className="couples-grid">
                                {couples.map((couple) => (
                                    <div key={couple._id} className="couple-card">
                                        {/* Status Badge */}
                                        <div className="flex justify-between items-start mb-4">
                                            {couple.isPaired ? (
                                                <span className="badge badge-success">Paired</span>
                                            ) : (
                                                <span className="badge badge-warning">Pending</span>
                                            )}
                                            {couple.coupleTag && (
                                                <span className="text-pink-600 font-semibold text-sm">
                                                    {couple.coupleTag}
                                                </span>
                                            )}
                                        </div>

                                        {/* Partners */}
                                        <div className="mb-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Heart size={16} className="text-red-500" />
                                                <span className="font-semibold text-gray-900">
                                                    {couple.partner1Id?.name || 'N/A'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Heart size={16} className="text-red-500" />
                                                <span className="font-semibold text-gray-900">
                                                    {couple.partner2Id?.name || 'Pending'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Dates */}
                                        <div className="space-y-2 text-sm">
                                            {couple.anniversaryDate && (
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Calendar size={14} />
                                                    <span>
                                                        {formatDate(couple.anniversaryDate)}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <Clock size={14} />
                                                <span>Created {formatDate(couple.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            <div className="flex justify-between items-center mt-6">
                                <p className="text-sm text-gray-600">
                                    Page {page} of {totalPages}
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setPage(page - 1)}
                                        disabled={page === 1}
                                        className="btn-secondary disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setPage(page + 1)}
                                        disabled={page === totalPages}
                                        className="btn-secondary disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
