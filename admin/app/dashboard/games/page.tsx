'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';

export default function GamesPage() {
    const { token } = useAuth();
    const [categories, setCategories] = useState<any[]>([]);
    const [questions, setQuestions] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [loading, setLoading] = useState(false);

    // Category form
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [categoryForm, setCategoryForm] = useState({
        gameType: 'never_have_i_ever',
        name: '',
        emoji: '',
        tags: '',
        color: '#fef3c7',
        isTrending: false,
    });

    // Question form
    const [showQuestionForm, setShowQuestionForm] = useState(false);
    const [questionForm, setQuestionForm] = useState({
        categoryId: '',
        text: '',
    });

    useEffect(() => {
        if (token) {
            fetchCategories();
        }
    }, [token]);

    useEffect(() => {
        if (selectedCategory && token) {
            fetchQuestions(selectedCategory);
        }
    }, [selectedCategory, token]);

    const fetchCategories = async () => {
        try {
            const response = await apiClient.get('/admin/games/categories?gameType=never_have_i_ever', token!);
            setCategories(response.data);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const fetchQuestions = async (categoryId: string) => {
        setLoading(true);
        try {
            const response = await apiClient.get(`/admin/games/questions/category/${categoryId}`, token!);
            setQuestions(response.data);
        } catch (error) {
            console.error('Failed to fetch questions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const tagsArray = categoryForm.tags.split(',').map(t => t.trim()).filter(Boolean);
            await apiClient.post('/admin/games/categories', {
                ...categoryForm,
                tags: tagsArray,
            }, token!);
            setShowCategoryForm(false);
            setCategoryForm({
                gameType: 'never_have_i_ever',
                name: '',
                emoji: '',
                tags: '',
                color: '#fef3c7',
                isTrending: false,
            });
            fetchCategories();
        } catch (error) {
            console.error('Failed to create category:', error);
        }
    };

    const handleCreateQuestion = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiClient.post('/admin/games/questions', questionForm, token!);
            setShowQuestionForm(false);
            setQuestionForm({ categoryId: '', text: '' });
            if (selectedCategory) {
                fetchQuestions(selectedCategory);
            }
        } catch (error) {
            console.error('Failed to create question:', error);
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category?')) return;

        try {
            await apiClient.delete(`/admin/games/categories/${id}`, token!);
            fetchCategories();
        } catch (error: any) {
            alert(error.message || 'Failed to delete category');
        }
    };

    const handleDeleteQuestion = async (id: string) => {
        if (!confirm('Are you sure you want to delete this question?')) return;

        try {
            await apiClient.delete(`/admin/games/questions/${id}`, token!);
            if (selectedCategory) {
                fetchQuestions(selectedCategory);
            }
        } catch (error) {
            console.error('Failed to delete question:', error);
        }
    };

    const toggleTrending = async (id: string, currentStatus: boolean) => {
        try {
            await apiClient.put(`/admin/games/categories/${id}`, {
                isTrending: !currentStatus,
            }, token!);
            fetchCategories();
        } catch (error) {
            console.error('Failed to update category:', error);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Games Management</h1>
            </div>

            <div className="mb-4">
                <button onClick={() => setShowCategoryForm(!showCategoryForm)} className="btn-primary">
                    + Create Game Category
                </button>
            </div>

            {/* Category Form */}
            {showCategoryForm && (
                <div className="card mb-6">
                    <h3 className="text-lg font-semibold mb-4">New Game Category</h3>
                    <form onSubmit={handleCreateCategory} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Game Type</label>
                            <select
                                value={categoryForm.gameType}
                                onChange={(e) => setCategoryForm({ ...categoryForm, gameType: e.target.value })}
                                className="input"
                            >
                                <option value="never_have_i_ever">Never Have I Ever</option>
                                <option value="would_you_rather">Would You Rather</option>
                                <option value="who_more_likely">Who's More Likely To</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Name</label>
                            <input
                                type="text"
                                value={categoryForm.name}
                                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                                className="input"
                                placeholder="Travel F*ckups & Brags"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Emoji</label>
                                <input
                                    type="text"
                                    value={categoryForm.emoji}
                                    onChange={(e) => setCategoryForm({ ...categoryForm, emoji: e.target.value })}
                                    className="input"
                                    placeholder="🧳"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Color</label>
                                <input
                                    type="color"
                                    value={categoryForm.color}
                                    onChange={(e) => setCategoryForm({ ...categoryForm, color: e.target.value })}
                                    className="input h-10"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
                            <input
                                type="text"
                                value={categoryForm.tags}
                                onChange={(e) => setCategoryForm({ ...categoryForm, tags: e.target.value })}
                                className="input"
                                placeholder="#TravelOops, #Should'veStayedHome"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isTrending"
                                checked={categoryForm.isTrending}
                                onChange={(e) => setCategoryForm({ ...categoryForm, isTrending: e.target.checked })}
                                className="w-4 h-4"
                            />
                            <label htmlFor="isTrending" className="text-sm font-medium">
                                Mark as Trending
                            </label>
                        </div>
                        <div className="flex gap-2">
                            <button type="submit" className="btn-primary">Create</button>
                            <button type="button" onClick={() => setShowCategoryForm(false)} className="btn-secondary">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {categories.map((category) => (
                    <div
                        key={category._id}
                        className="card"
                        style={{ backgroundColor: category.color + '40' }}
                    >
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">{category.emoji}</span>
                                <div>
                                    <h3 className="font-bold text-lg">{category.name}</h3>
                                    <div className="flex gap-2 mt-1">
                                        {category.tags?.map((tag: string, idx: number) => (
                                            <span key={idx} className="text-xs text-blue-600">{tag}</span>
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {category.questionCount} questions • {category.timesPlayed} plays
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {category.isTrending && (
                                    <span className="badge bg-red-100 text-red-800">📈 Trending</span>
                                )}
                                <button
                                    onClick={() => toggleTrending(category._id, category.isTrending)}
                                    className="text-blue-600 hover:text-blue-700"
                                    title="Toggle trending"
                                >
                                    ⭐
                                </button>
                                <button
                                    onClick={() => handleDeleteCategory(category._id)}
                                    className="text-red-600 hover:text-red-700"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                        <button
                            onClick={() => setSelectedCategory(category._id)}
                            className="btn-secondary w-full mt-2"
                        >
                            Manage Questions
                        </button>
                    </div>
                ))}
            </div>

            {/* Questions Section */}
            {selectedCategory && (
                <div className="card">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold">
                            Questions for{' '}
                            {categories.find((c) => c._id === selectedCategory)?.name}
                        </h3>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowQuestionForm(!showQuestionForm)}
                                className="btn-primary"
                            >
                                + Add Question
                            </button>
                            <button onClick={() => setSelectedCategory('')} className="btn-secondary">
                                Close
                            </button>
                        </div>
                    </div>

                    {/* Question Form */}
                    {showQuestionForm && (
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                            <form onSubmit={handleCreateQuestion} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Question Text</label>
                                    <textarea
                                        value={questionForm.text}
                                        onChange={(e) => setQuestionForm({ ...questionForm, text: e.target.value })}
                                        className="input"
                                        rows={2}
                                        placeholder="Never have I ever..."
                                        required
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        onClick={() => setQuestionForm({ ...questionForm, categoryId: selectedCategory })}
                                        className="btn-primary"
                                    >
                                        Add
                                    </button>
                                    <button type="button" onClick={() => setShowQuestionForm(false)} className="btn-secondary">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Questions List */}
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {questions.map((question, idx) => (
                                <div key={question._id} className="flex justify-between items-center p-3 bg-white rounded border">
                                    <div className="flex-1">
                                        <span className="font-medium mr-2">{idx + 1}.</span>
                                        {question.text}
                                        <span className="text-xs text-gray-500 ml-2">
                                            (Played {question.timesPlayed || 0} times)
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteQuestion(question._id)}
                                        className="text-red-600 hover:text-red-700 ml-4"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            ))}
                            {questions.length === 0 && (
                                <p className="text-center text-gray-500 py-8">No questions yet. Add some!</p>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
