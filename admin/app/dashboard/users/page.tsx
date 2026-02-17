'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { LayoutGrid, Table as TableIcon, User, Mail, Phone, Clock } from 'lucide-react';

type ViewMode = 'table' | 'card';

export default function UsersPage() {
    const { token } = useAuth();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [viewMode, setViewMode] = useState<ViewMode>('table');

    // Load view preference from localStorage
    useEffect(() => {
        const savedView = localStorage.getItem('users-view-mode') as ViewMode;
        if (savedView === 'table' || savedView === 'card') {
            setViewMode(savedView);
        }
    }, []);

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
                `/admin/dashboard/users?page=${page}&limit=20&search=${search}`,
                token
            );
            console.log('Users response:', response);
            setUsers(response.data.users || []);
            setTotalPages(response.data.pagination?.pages || 1);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleViewMode = (mode: ViewMode) => {
        setViewMode(mode);
        localStorage.setItem('users-view-mode', mode);
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

                {/* View Toggle */}
                <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => toggleViewMode('table')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${viewMode === 'table'
                                ? 'bg-white shadow-sm text-blue-600 font-medium'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        <TableIcon size={18} />
                        <span className="text-sm">Table</span>
                    </button>
                    <button
                        onClick={() => toggleViewMode('card')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${viewMode === 'card'
                                ? 'bg-white shadow-sm text-blue-600 font-medium'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        <LayoutGrid size={18} />
                        <span className="text-sm">Cards</span>
                    </button>
                </div>
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

            {/* Users Table View */}
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
                                                    <span className="badge badge-warning">
                                                        Unpaired
                                                    </span>
                                                )}
                                            </td>
                                            <td>{user.coupleId?.coupleTag || '-'}</td>
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
            )}

            {/* Users Card View */}
            {viewMode === 'card' && (
                <div>
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <>
                            <div className="users-grid">
                                {users.map((user) => (
                                    <div key={user._id} className="user-card">
                                        {/* Status Badge */}
                                        <div className="flex justify-between items-start mb-4">
                                            {user.coupleId?.isPaired ? (
                                                <span className="badge badge-success">Paired</span>
                                            ) : (
                                                <span className="badge badge-warning">Unpaired</span>
                                            )}
                                            {user.coupleId?.coupleTag && (
                                                <span className="text-pink-600 font-semibold text-sm">
                                                    {user.coupleId.coupleTag}
                                                </span>
                                            )}
                                        </div>

                                        {/* User Info */}
                                        <div className="mb-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <User size={16} className="text-blue-500" />
                                                <span className="font-semibold text-gray-900">
                                                    {user.name || 'N/A'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <Mail size={16} className="text-gray-400" />
                                                <span className="text-sm text-gray-600 truncate">
                                                    {user.email}
                                                </span>
                                            </div>
                                            {user.phone && (
                                                <div className="flex items-center gap-2">
                                                    <Phone size={16} className="text-gray-400" />
                                                    <span className="text-sm text-gray-600">
                                                        {user.phone}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Joined Date */}
                                        <div className="text-sm">
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <Clock size={14} />
                                                <span>Joined {formatDate(user.createdAt)}</span>
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
