'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Plus, Edit, Trash2, FolderPlus, Gamepad2 } from 'lucide-react';
import { toast } from 'sonner';

export default function GamesPage() {
    const { token } = useAuth();
    const [categories, setCategories] = useState<any[]>([]);
    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);
    const [isCreateQuestionOpen, setIsCreateQuestionOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<any>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const [categoryForm, setCategoryForm] = useState({
        name: '',
        emoji: '🎮',
        tags: [] as string[],
        color: '#3B82F6',
    });

    const [questionForm, setQuestionForm] = useState({
        categoryId: '',
        text: '',
    });

    useEffect(() => {
        if (token) {
            fetchCategories();
            fetchQuestions();
        }
    }, [token, selectedCategory]);

    const fetchCategories = async () => {
        try {
            const response = await apiClient.get('/admin/games/categories', token!);
            if (response.success) {
                setCategories(response.data || []);
            }
        } catch (error) {
            toast.error('Failed to fetch game categories');
        }
    };

    const fetchQuestions = async () => {
        try {
            const endpoint =
                selectedCategory === 'all'
                    ? '/admin/games/questions'
                    : `/admin/games/questions/${selectedCategory}`;
            const response = await apiClient.get(endpoint, token!);
            if (response.success) {
                setQuestions(response.data || response.data?.questions || []);
            }
        } catch (error) {
            console.error('Failed to fetch game questions');
        }
    };

    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await apiClient.post('/admin/games/categories', categoryForm, token!);
            if (response.success) {
                toast.success('Game category created successfully');
                setIsCreateCategoryOpen(false);
                setCategoryForm({
                    name: '',
                    emoji: '🎮',
                    tags: [],
                    color: '#3B82F6',
                });
                fetchCategories();
            }
        } catch (error) {
            toast.error('Failed to create game category');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateQuestion = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (editingQuestion) {
                const response = await apiClient.put(
                    `/admin/games/questions/${editingQuestion._id}`,
                    questionForm,
                    token!
                );
                if (response.success) {
                    toast.success('Game question updated successfully');
                    setEditingQuestion(null);
                }
            } else {
                const response = await apiClient.post(
                    '/admin/games/questions',
                    questionForm,
                    token!
                );
                if (response.success) {
                    toast.success('Game question created successfully');
                }
            }
            setIsCreateQuestionOpen(false);
            setQuestionForm({
                categoryId: '',
                text: '',
            });
            fetchQuestions();
            fetchCategories();
        } catch (error) {
            toast.error(
                editingQuestion ? 'Failed to update question' : 'Failed to create question'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteQuestion = async (id: string) => {
        if (!confirm('Are you sure you want to delete this game question?')) return;

        try {
            const response = await apiClient.delete(`/admin/games/questions/${id}`, token!);
            if (response.success) {
                toast.success('Game question deleted');
                fetchQuestions();
                fetchCategories();
            }
        } catch (error) {
            toast.error('Failed to delete game question');
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category? It must have no questions.'))
            return;

        try {
            const response = await apiClient.delete(`/admin/games/categories/${id}`, token!);
            if (response.success) {
                toast.success('Game category deleted');
                fetchCategories();
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete category');
        }
    };

    const handleEditQuestion = (question: any) => {
        setEditingQuestion(question);
        setQuestionForm({
            categoryId: question.categoryId?._id || question.categoryId,
            text: question.text,
        });
        setIsCreateQuestionOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Games Management</h1>
                    <p className="text-muted-foreground">
                        Manage game categories and questions for Truth or Dare, Never Have I Ever,
                        etc.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Dialog open={isCreateCategoryOpen} onOpenChange={setIsCreateCategoryOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <FolderPlus className="mr-2 h-4 w-4" />
                                New Category
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create Game Category</DialogTitle>
                                <DialogDescription>
                                    Add a new category for organizing game questions
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreateCategory} className="space-y-4">
                                <div>
                                    <Label>Category Name</Label>
                                    <Input
                                        value={categoryForm.emoji}
                                        onChange={(e) =>
                                            setCategoryForm({
                                                ...categoryForm,
                                                emoji: e.target.value,
                                            })
                                        }
                                        placeholder="🎮"
                                        maxLength={2}
                                    />
                                </div>
                                <div>
                                    <Label>Category Name</Label>
                                    <Input
                                        value={categoryForm.name}
                                        onChange={(e) =>
                                            setCategoryForm({
                                                ...categoryForm,
                                                name: e.target.value,
                                            })
                                        }
                                        placeholder="e.g., Funny, Romantic, Spicy"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>Tags (comma separated)</Label>
                                    <Input
                                        value={categoryForm.tags.join(', ')}
                                        onChange={(e) =>
                                            setCategoryForm({
                                                ...categoryForm,
                                                tags: e.target.value
                                                    .split(',')
                                                    .map((t) => t.trim())
                                                    .filter(Boolean),
                                            })
                                        }
                                        placeholder="funny, romantic, spicy"
                                    />
                                </div>
                                <div>
                                    <Label>Color</Label>
                                    <Input
                                        type="color"
                                        value={categoryForm.color}
                                        onChange={(e) =>
                                            setCategoryForm({
                                                ...categoryForm,
                                                color: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <Button type="submit" disabled={loading} className="w-full">
                                    {loading ? 'Creating...' : 'Create Category'}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isCreateQuestionOpen} onOpenChange={setIsCreateQuestionOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => setEditingQuestion(null)}>
                                <Plus className="mr-2 h-4 w-4" />
                                New Question
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    {editingQuestion
                                        ? 'Edit Game Question'
                                        : 'Create New Game Question'}
                                </DialogTitle>
                                <DialogDescription>
                                    {editingQuestion
                                        ? 'Update the game question'
                                        : 'Add a new question to the game'}
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreateQuestion} className="space-y-4">
                                <div>
                                    <Label>Category</Label>
                                    <Select
                                        value={questionForm.categoryId}
                                        onValueChange={(value) =>
                                            setQuestionForm({ ...questionForm, categoryId: value })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat._id} value={cat._id}>
                                                    {cat.emoji} {cat.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Question Text</Label>
                                    <Textarea
                                        value={questionForm.text}
                                        onChange={(e) =>
                                            setQuestionForm({
                                                ...questionForm,
                                                text: e.target.value,
                                            })
                                        }
                                        placeholder="Enter the game question"
                                        required
                                        rows={3}
                                    />
                                </div>
                                <Button type="submit" disabled={loading} className="w-full">
                                    {loading
                                        ? 'Saving...'
                                        : editingQuestion
                                          ? 'Update Question'
                                          : 'Create Question'}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Categories Grid */}
            <div className="grid gap-4 md:grid-cols-4">
                {categories.map((category) => (
                    <Card key={category._id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <span className="text-2xl">{category.emoji}</span>
                                {category.name}
                            </CardTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteCategory(category._id)}
                            >
                                <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{category.questionCount || 0}</div>
                            <p className="text-xs text-muted-foreground">Questions</p>
                            {category.tags && category.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {category.tags.map((tag: string, idx: number) => (
                                        <Badge key={idx} variant="outline" className="text-xs">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Questions Filter and Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>All Game Questions</CardTitle>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="w-[250px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map((cat) => (
                                    <SelectItem key={cat._id} value={cat._id}>
                                        {cat.emoji} {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Question</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {questions.map((question) => (
                                <TableRow key={question._id}>
                                    <TableCell className="font-medium max-w-md">
                                        {question.text}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {question.categoryId?.emoji} {question.categoryId?.name}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleEditQuestion(question)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleDeleteQuestion(question._id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
