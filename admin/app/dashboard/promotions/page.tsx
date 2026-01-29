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
import { Plus, Gift, Trash2, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';

export default function PromotionsPage() {
    const { token } = useAuth();
    const [promotions, setPromotions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const [promotionForm, setPromotionForm] = useState({
        code: '',
        title: '',
        description: '',
        type: 'discount',
        value: 0,
        applicableTo: 'all',
        usageLimit: 0,
        startDate: new Date().toISOString().slice(0, 16),
        endDate: '',
    });

    useEffect(() => {
        if (token) {
            fetchPromotions();
        }
    }, [token]);

    const fetchPromotions = async () => {
        try {
            const response = await apiClient.get('/admin/promotions', token!);
            if (response.success) {
                setPromotions(response.data.promotions || []);
            }
        } catch (error) {
            toast.error('Failed to fetch promotions');
        }
    };

    const handleCreatePromotion = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await apiClient.post(
                '/admin/promotions',
                { ...promotionForm, code: promotionForm.code.toUpperCase() },
                token!
            );
            if (response.success) {
                toast.success('Promotion created successfully');
                setIsCreateOpen(false);
                setPromotionForm({
                    code: '',
                    title: '',
                    description: '',
                    type: 'discount',
                    value: 0,
                    applicableTo: 'all',
                    usageLimit: 0,
                    startDate: new Date().toISOString().slice(0, 16),
                    endDate: '',
                });
                fetchPromotions();
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to create promotion');
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePromotion = async (id: string) => {
        if (!confirm('Are you sure you want to delete this promotion?')) return;

        try {
            const response = await apiClient.delete(`/admin/promotions/${id}`, token!);
            if (response.success) {
                toast.success('Promotion deleted');
                fetchPromotions();
            }
        } catch (error) {
            toast.error('Failed to delete promotion');
        }
    };

    const handleToggleActive = async (promotion: any) => {
        try {
            const response = await apiClient.put(
                `/admin/promotions/${promotion._id}`,
                { isActive: !promotion.isActive },
                token!
            );
            if (response.success) {
                toast.success(promotion.isActive ? 'Promotion deactivated' : 'Promotion activated');
                fetchPromotions();
            }
        } catch (error) {
            toast.error('Failed to update promotion');
        }
    };

    const getUsagePercentage = (used: number, limit: number) => {
        if (!limit || limit === 0) return 0;
        return Math.round((used / limit) * 100);
    };

    const isExpired = (endDate: string) => {
        if (!endDate) return false;
        return new Date(endDate) < new Date();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Promotions</h1>
                    <p className="text-muted-foreground">
                        Create and manage promotional codes and offers
                    </p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            New Promotion
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Create New Promotion</DialogTitle>
                            <DialogDescription>
                                Set up a new promotional code or offer
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreatePromotion} className="space-y-4">
                            <div>
                                <Label>Promotion Code</Label>
                                <Input
                                    value={promotionForm.code}
                                    onChange={(e) =>
                                        setPromotionForm({
                                            ...promotionForm,
                                            code: e.target.value.toUpperCase(),
                                        })
                                    }
                                    placeholder="e.g., WELCOME2024"
                                    required
                                    className="uppercase"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Will be automatically converted to uppercase
                                </p>
                            </div>
                            <div>
                                <Label>Title</Label>
                                <Input
                                    value={promotionForm.title}
                                    onChange={(e) =>
                                        setPromotionForm({
                                            ...promotionForm,
                                            title: e.target.value,
                                        })
                                    }
                                    placeholder="e.g., Welcome Bonus"
                                    required
                                />
                            </div>
                            <div>
                                <Label>Description</Label>
                                <Textarea
                                    value={promotionForm.description}
                                    onChange={(e) =>
                                        setPromotionForm({
                                            ...promotionForm,
                                            description: e.target.value,
                                        })
                                    }
                                    placeholder="Describe the promotion"
                                    rows={2}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label>Type</Label>
                                    <Select
                                        value={promotionForm.type}
                                        onValueChange={(value) =>
                                            setPromotionForm({ ...promotionForm, type: value })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="feature_unlock">
                                                Feature Unlock
                                            </SelectItem>
                                            <SelectItem value="discount">Discount</SelectItem>
                                            <SelectItem value="special_access">
                                                Special Access
                                            </SelectItem>
                                            <SelectItem value="premium_trial">
                                                Premium Trial
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>
                                        Value {promotionForm.type === 'discount' ? '(%)' : ''}
                                    </Label>
                                    <Input
                                        type="number"
                                        value={promotionForm.value}
                                        onChange={(e) =>
                                            setPromotionForm({
                                                ...promotionForm,
                                                value: parseInt(e.target.value),
                                            })
                                        }
                                        placeholder={promotionForm.type === 'discount' ? '10' : '1'}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label>Applicable To</Label>
                                    <Select
                                        value={promotionForm.applicableTo}
                                        onValueChange={(value) =>
                                            setPromotionForm({
                                                ...promotionForm,
                                                applicableTo: value,
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Features</SelectItem>
                                            <SelectItem value="premium">Premium Only</SelectItem>
                                            <SelectItem value="games">Games</SelectItem>
                                            <SelectItem value="questions">Questions</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Usage Limit (0 = unlimited)</Label>
                                    <Input
                                        type="number"
                                        value={promotionForm.usageLimit}
                                        onChange={(e) =>
                                            setPromotionForm({
                                                ...promotionForm,
                                                usageLimit: parseInt(e.target.value),
                                            })
                                        }
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label>Start Date</Label>
                                    <Input
                                        type="datetime-local"
                                        value={promotionForm.startDate}
                                        onChange={(e) =>
                                            setPromotionForm({
                                                ...promotionForm,
                                                startDate: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>End Date (Optional)</Label>
                                    <Input
                                        type="datetime-local"
                                        value={promotionForm.endDate}
                                        onChange={(e) =>
                                            setPromotionForm({
                                                ...promotionForm,
                                                endDate: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>
                            <Button type="submit" disabled={loading} className="w-full">
                                {loading ? 'Creating...' : 'Create Promotion'}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Promotions</CardTitle>
                        <Gift className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{promotions.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active</CardTitle>
                        <Gift className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {promotions.filter((p) => p.isActive).length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Redemptions</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {promotions.reduce((acc, p) => acc + (p.usedCount || 0), 0)}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Expired</CardTitle>
                        <Gift className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {promotions.filter((p) => isExpired(p.endDate)).length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Promotions Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Promotions</CardTitle>
                    <CardDescription>Manage promotional codes and offers</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Code</TableHead>
                                <TableHead>Details</TableHead>
                                <TableHead>Type & Value</TableHead>
                                <TableHead>Usage</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Dates</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {promotions.map((promotion) => (
                                <TableRow key={promotion._id}>
                                    <TableCell>
                                        <code className="bg-gray-100 px-2 py-1 rounded font-bold text-sm">
                                            {promotion.code}
                                        </code>
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{promotion.title}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {promotion.description}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <Badge variant="outline" className="capitalize">
                                                {promotion.type.replace('_', ' ')}
                                            </Badge>
                                            <div className="text-sm font-medium">
                                                {promotion.type === 'discount'
                                                    ? `${promotion.value}%`
                                                    : promotion.value}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <div className="text-sm">
                                                {promotion.usedCount || 0}
                                                {promotion.usageLimit > 0 &&
                                                    ` / ${promotion.usageLimit}`}
                                            </div>
                                            {promotion.usageLimit > 0 && (
                                                <div className="w-24">
                                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-blue-500"
                                                            style={{
                                                                width: `${getUsagePercentage(
                                                                    promotion.usedCount,
                                                                    promotion.usageLimit
                                                                )}%`,
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            {promotion.isActive ? (
                                                <Badge className="bg-green-500">Active</Badge>
                                            ) : (
                                                <Badge variant="secondary">Inactive</Badge>
                                            )}
                                            {isExpired(promotion.endDate) && (
                                                <Badge variant="destructive">Expired</Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm text-muted-foreground space-y-1">
                                            <div>
                                                Start:{' '}
                                                {new Date(promotion.startDate).toLocaleDateString()}
                                            </div>
                                            {promotion.endDate && (
                                                <div>
                                                    End:{' '}
                                                    {new Date(
                                                        promotion.endDate
                                                    ).toLocaleDateString()}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant={promotion.isActive ? 'outline' : 'default'}
                                                onClick={() => handleToggleActive(promotion)}
                                            >
                                                {promotion.isActive ? 'Deactivate' : 'Activate'}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleDeletePromotion(promotion._id)}
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
