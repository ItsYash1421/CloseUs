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
import { Plus, Play, Pause, Trash2, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';

export default function CampaignsPage() {
    const { token } = useAuth();
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const [campaignForm, setCampaignForm] = useState({
        name: '',
        type: 'promotion',
        description: '',
        content: {
            title: '',
            message: '',
        },
        targetAudience: {
            allUsers: true,
            coupleStatus: 'all',
        },
        schedule: {
            startDate: new Date().toISOString().slice(0, 16),
            endDate: '',
        },
    });

    useEffect(() => {
        if (token) {
            fetchCampaigns();
        }
    }, [token]);

    const fetchCampaigns = async () => {
        try {
            const response = await apiClient.get('/admin/campaigns', token!);
            if (response.success) {
                setCampaigns(response.data.campaigns || []);
            }
        } catch (error) {
            toast.error('Failed to fetch campaigns');
        }
    };

    const handleCreateCampaign = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await apiClient.post('/admin/campaigns', campaignForm, token!);
            if (response.success) {
                toast.success('Campaign created successfully');
                setIsCreateOpen(false);
                setCampaignForm({
                    name: '',
                    type: 'promotion',
                    description: '',
                    content: {
                        title: '',
                        message: '',
                    },
                    targetAudience: {
                        allUsers: true,
                        coupleStatus: 'all',
                    },
                    schedule: {
                        startDate: new Date().toISOString().slice(0, 16),
                        endDate: '',
                    },
                });
                fetchCampaigns();
            }
        } catch (error) {
            toast.error('Failed to create campaign');
        } finally {
            setLoading(false);
        }
    };

    const handleLaunchCampaign = async (id: string) => {
        if (!confirm('Launch this campaign now?')) return;

        try {
            const response = await apiClient.post(`/admin/campaigns/${id}/launch`, {}, token!);
            if (response.success) {
                toast.success('Campaign launched successfully');
                fetchCampaigns();
            }
        } catch (error) {
            toast.error('Failed to launch campaign');
        }
    };

    const handlePauseCampaign = async (id: string) => {
        try {
            const response = await apiClient.post(`/admin/campaigns/${id}/pause`, {}, token!);
            if (response.success) {
                toast.success('Campaign paused');
                fetchCampaigns();
            }
        } catch (error) {
            toast.error('Failed to pause campaign');
        }
    };

    const handleDeleteCampaign = async (id: string) => {
        if (!confirm('Are you sure you want to delete this campaign?')) return;

        try {
            const response = await apiClient.delete(`/admin/campaigns/${id}`, token!);
            if (response.success) {
                toast.success('Campaign deleted');
                fetchCampaigns();
            }
        } catch (error) {
            toast.error('Failed to delete campaign');
        }
    };

    const getStatusBadge = (status: string) => {
        const statusConfig: any = {
            draft: { variant: 'secondary', label: 'Draft' },
            active: { className: 'bg-green-500', label: 'Active' },
            paused: { className: 'bg-yellow-500', label: 'Paused' },
            completed: { variant: 'outline', label: 'Completed' },
        };
        const config = statusConfig[status] || statusConfig.draft;
        return <Badge className={config.className} variant={config.variant}>{config.label}</Badge>;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Campaigns</h1>
                    <p className="text-muted-foreground">
                        Create and manage marketing campaigns
                    </p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            New Campaign
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Create New Campaign</DialogTitle>
                            <DialogDescription>
                                Set up a new marketing campaign to engage users
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateCampaign} className="space-y-4">
                            <div>
                                <Label>Campaign Name</Label>
                                <Input
                                    value={campaignForm.name}
                                    onChange={(e) =>
                                        setCampaignForm({ ...campaignForm, name: e.target.value })
                                    }
                                    placeholder="e.g., Valentine's Day Special"
                                    required
                                />
                            </div>
                            <div>
                                <Label>Campaign Type</Label>
                                <Select
                                    value={campaignForm.type}
                                    onValueChange={(value) =>
                                        setCampaignForm({ ...campaignForm, type: value })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="promotion">Promotion</SelectItem>
                                        <SelectItem value="event">Event</SelectItem>
                                        <SelectItem value="feature_launch">Feature Launch</SelectItem>
                                        <SelectItem value="announcement">Announcement</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Description</Label>
                                <Textarea
                                    value={campaignForm.description}
                                    onChange={(e) =>
                                        setCampaignForm({ ...campaignForm, description: e.target.value })
                                    }
                                    placeholder="Brief description of the campaign"
                                    rows={2}
                                />
                            </div>
                            <div className="border-t pt-4">
                                <h3 className="font-semibold mb-3">Content</h3>
                                <div className="space-y-3">
                                    <div>
                                        <Label>Title</Label>
                                        <Input
                                            value={campaignForm.content.title}
                                            onChange={(e) =>
                                                setCampaignForm({
                                                    ...campaignForm,
                                                    content: { ...campaignForm.content, title: e.target.value },
                                                })
                                            }
                                            placeholder="Campaign title"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label>Message</Label>
                                        <Textarea
                                            value={campaignForm.content.message}
                                            onChange={(e) =>
                                                setCampaignForm({
                                                    ...campaignForm,
                                                    content: { ...campaignForm.content, message: e.target.value },
                                                })
                                            }
                                            placeholder="Campaign message"
                                            required
                                            rows={3}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="border-t pt-4">
                                <h3 className="font-semibold mb-3">Target Audience</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="allUsers"
                                            checked={campaignForm.targetAudience.allUsers}
                                            onChange={(e) =>
                                                setCampaignForm({
                                                    ...campaignForm,
                                                    targetAudience: {
                                                        ...campaignForm.targetAudience,
                                                        allUsers: e.target.checked,
                                                    },
                                                })
                                            }
                                            className="rounded"
                                        />
                                        <Label htmlFor="allUsers">Send to all users</Label>
                                    </div>
                                    {!campaignForm.targetAudience.allUsers && (
                                        <div>
                                            <Label>Couple Status</Label>
                                            <Select
                                                value={campaignForm.targetAudience.coupleStatus}
                                                onValueChange={(value) =>
                                                    setCampaignForm({
                                                        ...campaignForm,
                                                        targetAudience: {
                                                            ...campaignForm.targetAudience,
                                                            coupleStatus: value,
                                                        },
                                                    })
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All</SelectItem>
                                                    <SelectItem value="paired">Paired Only</SelectItem>
                                                    <SelectItem value="unpaired">Unpaired Only</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="border-t pt-4">
                                <h3 className="font-semibold mb-3">Schedule</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <Label>Start Date</Label>
                                        <Input
                                            type="datetime-local"
                                            value={campaignForm.schedule.startDate}
                                            onChange={(e) =>
                                                setCampaignForm({
                                                    ...campaignForm,
                                                    schedule: {
                                                        ...campaignForm.schedule,
                                                        startDate: e.target.value,
                                                    },
                                                })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <Label>End Date (Optional)</Label>
                                        <Input
                                            type="datetime-local"
                                            value={campaignForm.schedule.endDate}
                                            onChange={(e) =>
                                                setCampaignForm({
                                                    ...campaignForm,
                                                    schedule: {
                                                        ...campaignForm.schedule,
                                                        endDate: e.target.value,
                                                    },
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            <Button type="submit" disabled={loading} className="w-full">
                                {loading ? 'Creating...' : 'Create Campaign'}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Campaigns Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Campaigns</CardTitle>
                    <CardDescription>Manage and monitor your campaigns</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Campaign</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Metrics</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {campaigns.map((campaign) => (
                                <TableRow key={campaign._id}>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{campaign.name}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {campaign.description}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="capitalize">
                                            {campaign.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                                    <TableCell>
                                        <div className="text-sm space-y-1">
                                            <div>Sent: {campaign.metrics?.sent || 0}</div>
                                            <div>Viewed: {campaign.metrics?.viewed || 0}</div>
                                            <div>Clicked: {campaign.metrics?.clicked || 0}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm text-muted-foreground">
                                            {new Date(campaign.createdAt).toLocaleDateString()}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {campaign.status === 'draft' && (
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleLaunchCampaign(campaign._id)}
                                                >
                                                    <Play className="h-4 w-4" />
                                                </Button>
                                            )}
                                            {campaign.status === 'active' && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handlePauseCampaign(campaign._id)}
                                                >
                                                    <Pause className="h-4 w-4" />
                                                </Button>
                                            )}
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleDeleteCampaign(campaign._id)}
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
