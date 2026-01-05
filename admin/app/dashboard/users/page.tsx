'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';

export default function UsersPage() {
    const { token } = useAuth();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        console.log('Users page - token:', token);
        fetchUsers();
    }, [token, page, search]);

    const fetchUsers = async () => {
        console.log('fetchUsers called, token:', token);
        if (!token) {
            console.log('No token found, skipping API call');
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const response = await apiClient.get(
                `/admin/users?page=${page}&limit=20&search=${search}`,
                token
            );
            console.log('Users response:', response);
            setUsers(response.data.users);
            setTotalPages(response.data.pagination.pages);
        } catch (error) {
            console.error('Failed to fetch users:', error);
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
                <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
            </div>

            {/* Search */}
            <div className="card mb-6">
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input"
                />
            </div>

            {/* Users Table */}
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
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Couple Status</th>
                                    <th>Couple Tag</th>
                                    <th>Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user._id}>
                                        <td className="font-medium">{user.name || 'N/A'}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phone || 'N/A'}</td>
                                        <td>
                                            {user.coupleId?.isPaired ? (
                                                <span className="badge badge-success">Paired</span>
                                            ) : (
                                                <span className="badge badge-warning">Unpaired</span>
                                            )}
                                        </td>
                                        <td>
                                            {user.coupleId?.coupleTag || '-'}
                                        </td>
                                        <td className="text-gray-500">
                                            {formatDate(user.createdAt)}
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
