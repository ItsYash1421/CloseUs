'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';

export default function CouplesPage() {
    const { token } = useAuth();
    const [couples, setCouples] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchCouples();
    }, [token, page]);

    const fetchCouples = async () => {
        if (!token) return;

        setLoading(true);
        try {
            const response = await apiClient.get(`/admin/dashboard/couples?page=${page}&limit=20`, token);
            setCouples(response.data.couples);
            setTotalPages(response.data.pagination.pages);
        } catch (error) {
            console.error('Failed to fetch couples:', error);
        } finally {
            setLoading(false);
        }
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
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Couples Management</h1>
            </div>

            {/* Couples Table */}
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
                                                <span className="badge badge-success">Paired</span>
                                            ) : (
                                                <span className="badge badge-warning">Pending</span>
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
        </div>
    );
}
