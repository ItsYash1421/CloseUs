import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { GradientBackground, Card, Avatar, Button } from '../../components/common';
import { COLORS } from '../../constants/colors';
import THEME from '../../constants/theme';
import { useAuthStore } from '../../store/authStore';
import { useCoupleStore } from '../../store/coupleStore';

export const ProfileScreen = ({ navigation }: any) => {
    const { user, logout } = useAuthStore();
    const couple = useCoupleStore(state => state.couple);

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Logout',
                style: 'destructive',
                onPress: () => {
                    // Logout and navigate immediately without waiting
                    logout();
                    navigation.replace('Welcome');
                },
            },
        ]);
    };

    return (
        <GradientBackground variant="background">
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Avatar uri={user?.photoUrl} name={user?.name} size={100} />
                    <Text style={styles.name}>{user?.name}</Text>
                    <Text style={styles.email}>{user?.email}</Text>
                    {couple?.coupleTag && (
                        <Text style={styles.coupleTag}>{couple.coupleTag}</Text>
                    )}
                </View>

                {/* Relationship Info */}
                <Card variant="glass" padding="large" style={styles.card}>
                    <Text style={styles.cardTitle}>Relationship Info</Text>
                    <InfoRow label="Status" value={user?.relationshipStatus || 'Not set'} />
                    <InfoRow label="Living Style" value={user?.livingStyle || 'Not set'} />
                    <InfoRow
                        label="Anniversary"
                        value={user?.anniversary ? new Date(user.anniversary).toLocaleDateString() : 'Not set'}
                    />
                </Card>

                {/* Settings */}
                <Text style={styles.sectionTitle}>Settings</Text>
                <Card variant="glass" padding="none" style={styles.card}>
                    <SettingItem icon="✏️" title="Edit Profile" onPress={() => { }} />
                    <SettingItem icon="🔔" title="Notifications" onPress={() => { }} />
                    <SettingItem icon="🔒" title="Privacy" onPress={() => { }} />
                    <SettingItem icon="ℹ️" title="About" onPress={() => { }} />
                    <SettingItem icon="❓" title="Help & Support" onPress={() => { }} />
                </Card>

                {/* Logout */}
                <View style={styles.logoutContainer}>
                    <Button
                        title="Logout"
                        onPress={handleLogout}
                        variant="outline"
                        size="large"
                        fullWidth
                    />
                </View>

                <Text style={styles.version}>Version 1.0.0</Text>
            </ScrollView>
        </GradientBackground>
    );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
    </View>
);

const SettingItem = ({
    icon,
    title,
    onPress,
}: {
    icon: string;
    title: string;
    onPress: () => void;
}) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.settingLeft}>
            <Text style={styles.settingIcon}>{icon}</Text>
            <Text style={styles.settingTitle}>{title}</Text>
        </View>
        <Text style={styles.settingArrow}>›</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: THEME.spacing.lg,
    },
    header: {
        alignItems: 'center',
        marginTop: THEME.spacing.xl,
        marginBottom: THEME.spacing.xl,
    },
    name: {
        fontSize: THEME.fontSizes.xxl,
        fontWeight: THEME.fontWeights.bold,
        color: COLORS.white,
        marginTop: THEME.spacing.md,
    },
    email: {
        fontSize: THEME.fontSizes.sm,
        color: COLORS.textSecondary,
        marginTop: THEME.spacing.xs,
    },
    coupleTag: {
        fontSize: THEME.fontSizes.lg,
        fontWeight: THEME.fontWeights.semibold,
        color: COLORS.primary,
        marginTop: THEME.spacing.sm,
    },
    card: {
        marginBottom: THEME.spacing.lg,
    },
    cardTitle: {
        fontSize: THEME.fontSizes.lg,
        fontWeight: THEME.fontWeights.semibold,
        color: COLORS.white,
        marginBottom: THEME.spacing.md,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: THEME.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    infoLabel: {
        fontSize: THEME.fontSizes.sm,
        color: COLORS.textSecondary,
    },
    infoValue: {
        fontSize: THEME.fontSizes.sm,
        color: COLORS.white,
        fontWeight: THEME.fontWeights.medium,
    },
    sectionTitle: {
        fontSize: THEME.fontSizes.lg,
        fontWeight: THEME.fontWeights.semibold,
        color: COLORS.white,
        marginBottom: THEME.spacing.md,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: THEME.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: THEME.spacing.md,
    },
    settingIcon: {
        fontSize: 24,
    },
    settingTitle: {
        fontSize: THEME.fontSizes.md,
        color: COLORS.white,
        fontWeight: THEME.fontWeights.medium,
    },
    settingArrow: {
        fontSize: 24,
        color: COLORS.textMuted,
    },
    logoutContainer: {
        marginTop: THEME.spacing.xl,
        marginBottom: THEME.spacing.lg,
    },
    version: {
        fontSize: THEME.fontSizes.xs,
        color: COLORS.textMuted,
        textAlign: 'center',
        marginBottom: THEME.spacing.xl,
    },
});
