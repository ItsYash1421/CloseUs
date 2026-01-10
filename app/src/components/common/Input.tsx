import React, { useState } from 'react';
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    TextInputProps,
    ViewStyle,
} from 'react-native';
import { COLORS } from '../../constants/colors';
import THEME from '../../constants/theme';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    containerStyle?: ViewStyle;
    icon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    containerStyle,
    icon,
    rightIcon,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View
                style={[
                    styles.inputContainer,
                    isFocused && styles.inputContainerFocused,
                    error && styles.inputContainerError,
                ]}>
                {icon && <View style={styles.iconLeft}>{icon}</View>}
                <TextInput
                    style={[styles.input, icon && styles.inputWithIcon]}
                    placeholderTextColor={COLORS.textMuted}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...props}
                />
                {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
            </View>
            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: THEME.spacing.md,
    },
    label: {
        fontSize: THEME.fontSizes.sm,
        fontWeight: THEME.fontWeights.medium,
        color: COLORS.textSecondary,
        marginBottom: THEME.spacing.sm,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.backgroundCard,
        borderRadius: THEME.borderRadius.md,
        borderWidth: 1,
        borderColor: COLORS.border,
        paddingHorizontal: THEME.spacing.md,
    },
    inputContainerFocused: {
        borderColor: COLORS.primary,
    },
    inputContainerError: {
        borderColor: COLORS.error,
    },
    input: {
        flex: 1,
        fontSize: THEME.fontSizes.md,
        color: COLORS.textPrimary,
        paddingVertical: THEME.spacing.md,
    },
    inputWithIcon: {
        paddingLeft: THEME.spacing.sm,
    },
    iconLeft: {
        marginRight: THEME.spacing.sm,
    },
    iconRight: {
        marginLeft: THEME.spacing.sm,
    },
    error: {
        fontSize: THEME.fontSizes.xs,
        color: COLORS.error,
        marginTop: THEME.spacing.xs,
    },
});
