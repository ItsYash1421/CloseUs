import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../constants/colors';
import THEME from '../../constants/theme';

interface MenuItemProps {
    icon: string;
    title: string;
    onPress: () => void;
    showChevron?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, title, onPress, showChevron = true }) => (
    <TouchableOpacity
        style={styles.menuItem}
        onPress={onPress}
        activeOpacity={0.7}
    >
        <View style={styles.iconContainer}>
            <Icon name={icon} size={20} color={COLORS.blue400} />
        </View>
        <View style={styles.textContainer}>
            <Text style={styles.menuTitle}>{title}</Text>
        </View>
        {showChevron && <Icon name="chevron-right" size={24} color={COLORS.zinc400} />}
    </TouchableOpacity>
);

export const ProfileMenu = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>MENU</Text>

            <View style={styles.menuList}>
                <MenuItem
                    icon="edit"
                    title="Edit Profile"
                    onPress={() => { }}
                />
                <View style={styles.divider} />
                <MenuItem
                    icon="notifications"
                    title="Notifications"
                    onPress={() => { }}
                />
                <View style={styles.divider} />
                <MenuItem
                    icon="info"
                    title="About"
                    onPress={() => { }}
                />
                <View style={styles.divider} />
                <MenuItem
                    icon="help"
                    title="Help & Support"
                    onPress={() => { }}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20, // px-5
        marginTop: 32, // mt-8
    },
    sectionTitle: {
        fontSize: 12, // text-xs
        fontWeight: '700', // font-bold
        color: COLORS.profileSectionTitle, // White section title
        marginBottom: 12, // mb-3
        paddingLeft: 8, // pl-2
        letterSpacing: 2, // tracking-widest
        textTransform: 'uppercase', // uppercase
    },
    menuList: {
        backgroundColor: 'rgba(255, 255, 255, 0.03)', // Match ChatSection
        borderRadius: 12, // rounded-lg
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)', // Match ChatSection
        overflow: 'hidden',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16, // p-4
        gap: 16, // gap-4
    },
    iconContainer: {
        width: 40, // w-10
        height: 40, // h-10
        borderRadius: 12, // rounded-xl
        backgroundColor: COLORS.profileMenuIconBg, // Lighter icon background
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        flex: 1,
    },
    menuTitle: {
        fontSize: 16, // text-base
        fontWeight: '500', // font-medium
        color: COLORS.zinc50, // text-text-primary
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.profileDivider, // White divider
        marginLeft: 72, // Align with text start
    },
});
