'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Plus, Power, PowerOff, Trash2, Settings } from 'lucide-react';
import { toast } from 'sonner';

export default function FeaturesPage() {
    const { token } = useAuth();
    const [features, setFeatures] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingFeature, setEditingFeature] = useState<any>(null);

    const [featureForm, setFeatureForm] = useState({
        name: '',
        displayName: '',
        description: '',
        rolloutPercentage: 100,
    });

    useEffect(() => {
        if (token) {
            fetchFeatures();
        }
    }, [token]);

    const fetchFeatures = async () => {
        try {
            const response = await apiClient.get('/admin/features', token!);
            if (response.success) {
                setFeatures(response.data || []);
            }
        } catch (error) {
            toast.error('Failed to fetch features');
        }
    };

    const handleCreateFeature = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (editingFeature) {
                const response = await apiClient.put(
                    `/admin/features/${editingFeature._id}`,
                    featureForm,
                    token!
                );
                if (response.success) {
                    toast.success('Feature updated successfully');
                    setEditingFeature(null);
                }
            } else {
                const response = await apiClient.post('/admin/features', featureForm, token!);
                if (response.success) {
                    toast.success('Feature created successfully');
                }
            }
            setIsCreateOpen(false);
            setFeatureForm({
                name: '',
                displayName: '',
                description: '',
                rolloutPercentage: 100,
            });
            fetchFeatures();
        } catch (error: any) {
            toast.error(error.message || 'Failed to save feature');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleFeature = async (id: string) => {
        try {
            const response = await apiClient.post(`/admin/features/${id}/toggle`, {}, token!);
            if (response.success) {
                toast.success(response.message || 'Feature toggled');
                fetchFeatures();
            }
        } catch (error) {
            toast.error('Failed to toggle feature');
        }
    };

    const handleDeleteFeature = async (id: string) => {
        if (!confirm('Are you sure you want to delete this feature flag?')) return;

        try {
            const response = await apiClient.delete(`/admin/features/${id}`, token!);
            if (response.success) {
                toast.success('Feature deleted');
                fetchFeatures();
            }
        } catch (error) {
            toast.error('Failed to delete feature');
        }
    };

    const handleEditFeature = (feature: any) => {
        setEditingFeature(feature);
        setFeatureForm({
            name: feature.name,
            displayName: feature.displayName,
            description: feature.description || '',
            rolloutPercentage: feature.rolloutPercentage || 100,
        });
        setIsCreateOpen(true);
    };

    const handleUpdateRollout = async (id: string, percentage: number) => {
        try {
            const response = await apiClient.put(
                `/admin/features/${id}/rollout`,
                { rolloutPercentage: percentage },
                token!
            );
            if (response.success) {
                toast.success('Rollout percentage updated');
                fetchFeatures();
            }
        } catch (error) {
            toast.error('Failed to update rollout');
        }
    };

    // Predefined feature templates for common app features
    const featureTemplates = [
        {
            name: 'chat_enabled',
            displayName: '💬 Chat Feature',
            description: 'Enable/disable chat functionality',
        },
        {
            name: 'games_enabled',
            displayName: '🎮 Games Feature',
            description: 'Enable/disable games section',
        },
        {
            name: 'questions_enabled',
            displayName: '❓ Daily Questions',
            description: 'Enable/disable daily questions',
        },
        {
            name: 'promotions_enabled',
            displayName: '🎁 Promotions',
            description: 'Enable/disable promotions',
        },
        {
            name: 'maintenance_mode',
            displayName: '🔧 Maintenance Mode',
            description: 'Put app in maintenance mode',
        },
        {
            name: 'push_notifications',
            displayName: '🔔 Push Notifications',
            description: 'Enable/disable push notifications',
        },
        {
            name: 'profile_editing',
            displayName: '👤 Profile Editing',
            description: 'Allow users to edit profiles',
        },
        {
            name: 'media_upload',
            displayName: '📷 Media Upload',
            description: 'Enable media upload in chat',
        },
    ];

    const quickAddFeature = async (template: any) => {
        setFeatureForm({
            name: template.name,
            displayName: template.displayName,
            description: template.description,
            rolloutPercentage: 100,
        });
        setIsCreateOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Feature Flags</h1>
                    <p className="text-muted-foreground">
                        Control app features and functionality in real-time
                    </p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setEditingFeature(null)}>
                            <Plus className="mr-2 h-4 w-4" />
                            New Feature Flag
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {editingFeature ? 'Edit Feature Flag' : 'Create Feature Flag'}
                            </DialogTitle>
                            <DialogDescription>
                                {editingFeature
                                    ? 'Update the feature flag details'
                                    : 'Add a new feature flag to control app functionality'}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateFeature} className="space-y-4">
                            <div>
                                <Label>Feature Key (Technical Name)</Label>
                                <Input
                                    value={featureForm.name}
                                    onChange={(e) =>
                                        setFeatureForm({ ...featureForm, name: e.target.value })
                                    }
                                    placeholder="e.g., chat_enabled"
                                    required
                                    disabled={!!editingFeature}
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Use snake_case. Cannot be changed after creation.
                                </p>
                            </div>
                            <div>
                                <Label>Display Name</Label>
                                <Input
                                    value={featureForm.displayName}
                                    onChange={(e) =>
                                        setFeatureForm({
                                            ...featureForm,
                                            displayName: e.target.value,
                                        })
                                    }
                                    placeholder="e.g., Chat Feature"
                                    required
                                />
                            </div>
                            <div>
                                <Label>Description</Label>
                                <Textarea
                                    value={featureForm.description}
                                    onChange={(e) =>
                                        setFeatureForm({
                                            ...featureForm,
                                            description: e.target.value,
                                        })
                                    }
                                    placeholder="Describe what this feature controls"
                                    rows={2}
                                />
                            </div>
                            <div>
                                <Label>Rollout Percentage: {featureForm.rolloutPercentage}%</Label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={featureForm.rolloutPercentage}
                                    onChange={(e) =>
                                        setFeatureForm({
                                            ...featureForm,
                                            rolloutPercentage: parseInt(e.target.value),
                                        })
                                    }
                                    className="w-full"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Percentage of users who will see this feature
                                </p>
                            </div>
                            <Button type="submit" disabled={loading} className="w-full">
                                {loading
                                    ? 'Saving...'
                                    : editingFeature
                                      ? 'Update Feature'
                                      : 'Create Feature'}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Quick Add Templates */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Add Common Features</CardTitle>
                    <CardDescription>
                        Click to quickly add commonly used feature flags
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {featureTemplates.map((template) => (
                            <Button
                                key={template.name}
                                variant="outline"
                                size="sm"
                                onClick={() => quickAddFeature(template)}
                                className="justify-start"
                            >
                                {template.displayName}
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Features Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Active Feature Flags</CardTitle>
                    <CardDescription>Manage all feature flags in your app</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Feature</TableHead>
                                <TableHead>Key</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Rollout</TableHead>
                                <TableHead>Last Updated</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {features.map((feature) => (
                                <TableRow key={feature._id}>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{feature.displayName}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {feature.description}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                            {feature.name}
                                        </code>
                                    </TableCell>
                                    <TableCell>
                                        {feature.isEnabled ? (
                                            <Badge className="bg-green-500">Enabled</Badge>
                                        ) : (
                                            <Badge variant="secondary">Disabled</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm">
                                                {feature.rolloutPercentage}%
                                            </span>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={feature.rolloutPercentage}
                                                onChange={(e) =>
                                                    handleUpdateRollout(
                                                        feature._id,
                                                        parseInt(e.target.value)
                                                    )
                                                }
                                                className="w-20"
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm text-muted-foreground">
                                            {new Date(feature.updatedAt).toLocaleDateString()}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleToggleFeature(feature._id)}
                                            >
                                                {feature.isEnabled ? (
                                                    <PowerOff className="h-4 w-4 text-red-500" />
                                                ) : (
                                                    <Power className="h-4 w-4 text-green-500" />
                                                )}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleEditFeature(feature)}
                                            >
                                                <Settings className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleDeleteFeature(feature._id)}
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
