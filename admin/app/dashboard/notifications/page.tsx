'use client';

import { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
import { Bell, Plus, Send, Edit, Trash2, Power, PowerOff } from 'lucide-react';
import { toast } from 'sonner';

export default function NotificationsPage() {
    const [templates, setTemplates] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isSendOpen, setIsSendOpen] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        body: '',
        type: 'announcement',
        targetScreen: 'Home',
        emoji: '📢',
    });

    useEffect(() => {
        fetchTemplates();
        fetchStats();
    }, []);

    const fetchTemplates = async () => {
        try {
            const res = await fetch('/api/admin/notifications/templates');
            const data = await res.json();
            if (data.success) {
                setTemplates(data.data);
            }
        } catch (error) {
            toast.error('Failed to fetch templates');
        }
    };

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/admin/notifications/stats');
            const data = await res.json();
            if (data.success) {
                setStats(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch stats');
        }
    };

    const handleCreateTemplate = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/admin/notifications/templates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (data.success) {
                toast.success('Template created successfully');
                setIsCreateOpen(false);
                setFormData({
                    title: '',
                    body: '',
                    type: 'announcement',
                    targetScreen: 'Home',
                    emoji: '📢',
                });
                fetchTemplates();
                fetchStats();
            } else {
                toast.error(data.message || 'Failed to create template');
            }
        } catch (error) {
            toast.error('Failed to create template');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            const res = await fetch(`/api/admin/notifications/templates/${id}/toggle`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !currentStatus }),
            });

            const data = await res.json();
            if (data.success) {
                toast.success(data.message);
                fetchTemplates();
                fetchStats();
            }
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleDeleteTemplate = async (id) => {
        if (!confirm('Are you sure you want to delete this template?')) return;

        try {
            const res = await fetch(`/api/admin/notifications/templates/${id}`, {
                method: 'DELETE',
            });

            const data = await res.json();
            if (data.success) {
                toast.success('Template deleted');
                fetchTemplates();
                fetchStats();
            }
        } catch (error) {
            toast.error('Failed to delete template');
        }
    };

    const handleSendToAll = async (templateId) => {
        if (!confirm('Send this notification to ALL users?')) return;

        setLoading(true);
        try {
            const res = await fetch('/api/admin/notifications/send/all', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ templateId }),
            });

            const data = await res.json();
            if (data.success) {
                toast.success(`Sent to ${data.data.sentCount} users`);
                fetchTemplates();
                fetchStats();
            }
        } catch (error) {
            toast.error('Failed to send notifications');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Notifications</h1>
                    <p className="text-muted-foreground">
                        Manage notification templates and send to users
                    </p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Template
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create Notification Template</DialogTitle>
                            <DialogDescription>
                                Create a reusable notification template
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateTemplate} className="space-y-4">
                            <div>
                                <Label>Emoji</Label>
                                <Input
                                    value={formData.emoji}
                                    onChange={(e) =>
                                        setFormData({ ...formData, emoji: e.target.value })
                                    }
                                    placeholder="📢"
                                    maxLength={2}
                                />
                            </div>
                            <div>
                                <Label>Title</Label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({ ...formData, title: e.target.value })
                                    }
                                    placeholder="Notification title"
                                    required
                                />
                            </div>
                            <div>
                                <Label>Body</Label>
                                <Textarea
                                    value={formData.body}
                                    onChange={(e) =>
                                        setFormData({ ...formData, body: e.target.value })
                                    }
                                    placeholder="Notification message"
                                    required
                                />
                            </div>
                            <div>
                                <Label>Type</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(value) =>
                                        setFormData({ ...formData, type: value })
                                    }>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="announcement">Announcement</SelectItem>
                                        <SelectItem value="promotion">Promotion</SelectItem>
                                        <SelectItem value="reminder">Reminder</SelectItem>
                                        <SelectItem value="update">Update</SelectItem>
                                        <SelectItem value="custom">Custom</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Target Screen</Label>
                                <Select
                                    value={formData.targetScreen}
                                    onValueChange={(value) =>
                                        setFormData({ ...formData, targetScreen: value })
                                    }>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Home">Home</SelectItem>
                                        <SelectItem value="Chat">Chat</SelectItem>
                                        <SelectItem value="Questions">Questions</SelectItem>
                                        <SelectItem value="Games">Games</SelectItem>
                                        <SelectItem value="Profile">Profile</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="submit" disabled={loading} className="w-full">
                                {loading ? 'Creating...' : 'Create Template'}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats */}
            {stats && (
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Templates
                            </CardTitle>
                            <Bell className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalTemplates}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.activeTemplates} active
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Sent
                            </CardTitle>
                            <Send className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.totalNotificationsSent}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                All time notifications
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Users with Tokens
                            </CardTitle>
                            <Bell className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.usersWithPushTokens}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {stats.tokenCoverage}% coverage
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Users
                            </CardTitle>
                            <Bell className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalUsers}</div>
                            <p className="text-xs text-muted-foreground">
                                Registered users
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Templates Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Notification Templates</CardTitle>
                    <CardDescription>
                        Manage and send notification templates
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Sent</TableHead>
                                <TableHead>Screen</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {templates.map((template) => (
                                <TableRow key={template._id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span>{template.emoji}</span>
                                            <span className="font-medium">{template.title}</span>
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {template.body}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{template.type}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        {template.isActive ? (
                                            <Badge className="bg-green-500">Active</Badge>
                                        ) : (
                                            <Badge variant="secondary">Inactive</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>{template.sentCount}</TableCell>
                                    <TableCell>{template.targetScreen}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    handleToggleStatus(template._id, template.isActive)
                                                }>
                                                {template.isActive ? (
                                                    <PowerOff className="h-4 w-4" />
                                                ) : (
                                                    <Power className="h-4 w-4" />
                                                )}
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={() => handleSendToAll(template._id)}
                                                disabled={!template.isActive || loading}>
                                                <Send className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleDeleteTemplate(template._id)}>
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
