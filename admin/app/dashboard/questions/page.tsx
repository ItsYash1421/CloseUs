'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';

export default function QuestionsPage() {
    const { token } = useAuth();
    const [activeTab, setActiveTab] = useState<'categories' | 'questions'>('categories');
    const [categories, setCategories] = useState<any[]>([]);
    const [questions, setQuestions] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [loading, setLoading] = useState(false);

    // Category form
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [categoryForm, setCategoryForm] = useState({
        name: '',
        description: '',
        emoji: '',
        color: '#3b82f6',
    });

    // Question form
    const [showQuestionForm, setShowQuestionForm] = useState(false);
    const [questionForm, setQuestionForm] = useState({
        categoryId: '',
        text: '',
        isDaily: false,
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
            const response = await apiClient.get('/admin/questions/categories', token!);
            setCategories(response.data);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const fetchQuestions = async (categoryId: string) => {
        setLoading(true);
        try {
            const response = await apiClient.get(`/admin/questions/category/${categoryId}`, token!);
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
            await apiClient.post('/admin/questions/categories', categoryForm, token!);
            setShowCategoryForm(false);
            setCategoryForm({ name: '', description: '', emoji: '', color: '#3b82f6' });
            fetchCategories();
        } catch (error) {
            console.error('Failed to create category:', error);
        }
    };

    const handleCreateQuestion = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiClient.post('/admin/questions', questionForm, token!);
            setShowQuestionForm(false);
            setQuestionForm({ categoryId: '', text: '', isDaily: false });
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
            await apiClient.delete(`/admin/questions/categories/${id}`, token!);
            fetchCategories();
        } catch (error: any) {
            alert(error.message || 'Failed to delete category');
        }
    };

    const handleDeleteQuestion = async (id: string) => {
        if (!confirm('Are you sure you want to delete this question?')) return;

        try {
            await apiClient.delete(`/admin/questions/${id}`, token!);
            if (selectedCategory) {
                fetchQuestions(selectedCategory);
            }
        } catch (error) {
            console.error('Failed to delete question:', error);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Questions Management</h1>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => setActiveTab('categories')}
                    className={activeTab === 'categories' ? 'btn-primary' : 'btn-secondary'}
                >
                    Categories
                </button>
                <button
                    onClick={() => setActiveTab('questions')}
                    className={activeTab === 'questions' ? 'btn-primary' : 'btn-secondary'}
                >
                    Questions
                </button>
            </div>

            {/* Categories Tab */}
            {activeTab === 'categories' && (
                <div>
                    <div className="mb-4">
                        <button
                            onClick={() => setShowCategoryForm(!showCategoryForm)}
                            className="btn-primary"
                        >
                            + Create Category
                        </button>
                    </div>

                    {/* Category Form */}
                    {showCategoryForm && (
                        <div className="card mb-6">
                            <h3 className="text-lg font-semibold mb-4">New Category</h3>
                            <form onSubmit={handleCreateCategory} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Name</label>
                                    <input
                                        type="text"
                                        value={categoryForm.name}
                                        onChange={(e) =>
                                            setCategoryForm({
                                                ...categoryForm,
                                                name: e.target.value,
                                            })
                                        }
                                        className="input"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={categoryForm.description}
                                        onChange={(e) =>
                                            setCategoryForm({
                                                ...categoryForm,
                                                description: e.target.value,
                                            })
                                        }
                                        className="input"
                                        rows={2}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Emoji
                                        </label>
                                        <input
                                            type="text"
                                            value={categoryForm.emoji}
                                            onChange={(e) =>
                                                setCategoryForm({
                                                    ...categoryForm,
                                                    emoji: e.target.value,
                                                })
                                            }
                                            className="input"
                                            placeholder="💚"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Color
                                        </label>
                                        <input
                                            type="color"
                                            value={categoryForm.color}
                                            onChange={(e) =>
                                                setCategoryForm({
                                                    ...categoryForm,
                                                    color: e.target.value,
                                                })
                                            }
                                            className="input h-10"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button type="submit" className="btn-primary">
                                        Create
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowCategoryForm(false)}
                                        className="btn-secondary"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Categories List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categories.map((category) => (
                            <div key={category._id} className="card">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">{category.emoji}</span>
                                        <div>
                                            <h3 className="font-semibold">{category.name}</h3>
                                            <p className="text-sm text-gray-600">
                                                {category.questionCount} questions
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteCategory(category._id)}
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        🗑️
                                    </button>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                                <div className="flex gap-2">
                                    <div
                                        className="w-6 h-6 rounded"
                                        style={{ backgroundColor: category.color }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Questions Tab */}
            {activeTab === 'questions' && (
                <div>
                    <div className="flex gap-4 mb-6">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="input flex-1"
                        >
                            <option value="">Select a category...</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.emoji} {cat.name}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={() => setShowQuestionForm(!showQuestionForm)}
                            disabled={!selectedCategory}
                            className="btn-primary disabled:opacity-50"
                        >
                            + Add Question
                        </button>
                    </div>

                    {/* Question Form */}
                    {showQuestionForm && (
                        <div className="card mb-6">
                            <h3 className="text-lg font-semibold mb-4">New Question</h3>
                            <form onSubmit={handleCreateQuestion} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Question Text
                                    </label>
                                    <textarea
                                        value={questionForm.text}
                                        onChange={(e) =>
                                            setQuestionForm({
                                                ...questionForm,
                                                text: e.target.value,
                                            })
                                        }
                                        className="input"
                                        rows={3}
                                        required
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="isDaily"
                                        checked={questionForm.isDaily}
                                        onChange={(e) =>
                                            setQuestionForm({
                                                ...questionForm,
                                                isDaily: e.target.checked,
                                            })
                                        }
                                        className="w-4 h-4"
                                    />
                                    <label htmlFor="isDaily" className="text-sm font-medium">
                                        Set as Daily Question
                                    </label>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        onClick={() =>
                                            setQuestionForm({
                                                ...questionForm,
                                                categoryId: selectedCategory,
                                            })
                                        }
                                        className="btn-primary"
                                    >
                                        Create
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowQuestionForm(false)}
                                        className="btn-secondary"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Questions List */}
                    {selectedCategory && (
                        <div className="card">
                            {loading ? (
                                <div className="flex justify-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {questions.map((question) => (
                                        <div
                                            key={question._id}
                                            className="flex justify-between items-start p-4 bg-gray-50 rounded-lg"
                                        >
                                            <div className="flex-1">
                                                <p className="font-medium">{question.text}</p>
                                                <div className="flex gap-2 mt-2">
                                                    {question.isDaily && (
                                                        <span className="badge badge-warning">
                                                            Daily Question
                                                        </span>
                                                    )}
                                                    <span className="text-xs text-gray-500">
                                                        Answered {question.timesAnswered || 0} times
                                                    </span>
                                                </div>
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
                                        <p className="text-center text-gray-500 py-8">
                                            No questions yet
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
