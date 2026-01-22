import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    Alert,
    Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BottomSheet } from '../../common/BottomSheet';
import { COLORS } from '../../../constants/colors';
import { useAuthStore } from '../../../store/authStore';
import { launchImageLibrary } from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

interface EditProfileSheetProps {
    visible: boolean;
    onClose: () => void;
}

export const EditProfileSheet: React.FC<EditProfileSheetProps> = ({
    visible,
    onClose,
}) => {
    const { user, updateUser } = useAuthStore();

    // Default Avatar Assets
    const MALE_AVATAR = require('../../../assets/images/Logo-Male-2-bgless.png');
    const FEMALE_AVATAR = require('../../../assets/images/Logo-Female-2-bgless.png');

    const [name, setName] = useState(user?.name || '');
    const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || '');
    const [dob, setDob] = useState<Date | null>(
        user?.dob ? new Date(user.dob) : null
    );
    const [useDefaultAvatar, setUseDefaultAvatar] = useState(user?.isDefaultAvatar || false);

    // Toast State
    const [toast, setToast] = useState<{ visible: boolean; message: string; type: 'success' | 'error' }>({
        visible: false,
        message: '',
        type: 'success',
    });

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (visible && user) {
            setName(user.name || '');
            setPhotoUrl(user.photoUrl || '');
            setDob(user.dob ? new Date(user.dob) : null);
            // If user has no photoURL, default to using default avatar logic
            setUseDefaultAvatar(user.isDefaultAvatar || !user.photoUrl);
        }
    }, [visible, user]);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ visible: true, message, type });
        setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
    };

    const handleSave = async () => {
        if (!name.trim()) {
            showToast('Name cannot be empty', 'error');
            return;
        }

        setIsLoading(true);
        try {
            await updateUser({
                name,
                // If using default avatar, send empty string to clear custom photo? 
                // Or maybe backend handles "use default"? 
                // For now, if useDefaultAvatar is true, we might want to ensure photoUrl is cleared or ignored.
                // But the user said "waps off karega to uski image ajayegi". 
                // This implies we shouldn't necessarily DELETE it from backend unless confirmed.
                // However, to "Save" the state of "Using Default", we likely need to clear the photoUrl in the DB 
                // OR have a flag. Given the constraints, let's assume clearing photoUrl means "use default".
                photoUrl: useDefaultAvatar ? '' : photoUrl,
                dob: dob || undefined,
                isDefaultAvatar: useDefaultAvatar,
            });
            showToast('Profile updated successfully!', 'success');
            setTimeout(onClose, 1500); // Close after toast
        } catch (error) {
            console.error('Update profile error:', error);
            showToast('Failed to update profile', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Determine which image to display
    const getDisplayImage = () => {
        if (useDefaultAvatar) {
            return user?.gender === 'female' ? FEMALE_AVATAR : MALE_AVATAR;
        }
        return photoUrl ? { uri: photoUrl } : null;
    };

    return (
        <BottomSheet visible={visible} onClose={onClose} title="Edit Profile" height={560}>
            <View style={styles.container}>
                {/* Custom Toast */}
                {toast.visible && (
                    <View style={[styles.toast, toast.type === 'error' && styles.toastError]}>
                        <Icon
                            name={toast.type === 'success' ? 'check-circle' : 'error'}
                            size={20}
                            color={COLORS.white}
                        />
                        <Text style={styles.toastText}>{toast.message}</Text>
                    </View>
                )}

                {/* Profile Photo Display */}
                <View style={styles.photoContainer}>
                    {getDisplayImage() ? (
                        <Image source={getDisplayImage()} style={styles.photo} />
                    ) : (
                        <View style={styles.photoPlaceholder}>
                            <Icon name="person" size={40} color={COLORS.zinc400} />
                        </View>
                    )}
                </View>

                {/* Default Avatar Switch */}
                <View style={styles.switchContainer}>
                    <View style={styles.switchInfo}>
                        <Text style={styles.switchLabel}>Use Default App Logo</Text>
                        <Text style={styles.switchSubtext}>
                            Use the CloseUs logo as your profile picture
                        </Text>
                    </View>
                    <Switch
                        value={useDefaultAvatar}
                        onValueChange={setUseDefaultAvatar}
                        trackColor={{ false: '#3e3e3e', true: COLORS.blue500 }}
                        thumbColor={useDefaultAvatar ? COLORS.white : '#f4f3f4'}
                    />
                </View>

                {/* Name Input */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Name</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Your name"
                        placeholderTextColor={COLORS.zinc400}
                    />
                </View>

                {/* Date of Birth Picker */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Date of Birth</Text>
                    <TouchableOpacity
                        style={styles.dateButton}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Icon name="cake" size={20} color={COLORS.blue400} />
                        <Text style={styles.dateText}>
                            {dob
                                ? dob.toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                })
                                : 'Select date'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {showDatePicker && (
                    <DateTimePicker
                        value={dob || new Date()}
                        mode="date"
                        display="spinner"
                        onChange={(event, date) => {
                            setShowDatePicker(false);
                            if (date) setDob(date);
                        }}
                        maximumDate={new Date()}
                    />
                )}

                {/* Save Button */}
                <TouchableOpacity
                    style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
                    onPress={handleSave}
                    disabled={isLoading}
                    activeOpacity={0.8}
                >
                    <Text style={styles.saveButtonText}>
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </Text>
                </TouchableOpacity>
            </View>
        </BottomSheet>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingBottom: 0,
    },
    photoContainer: {
        alignSelf: 'center',
        marginBottom: 24,
        position: 'relative',
    },
    photo: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.zinc800,
    },
    photoPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.zinc800,
        alignItems: 'center',
        justifyContent: 'center',
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.blue500,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#1A1A2E',
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.zinc400,
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: COLORS.white,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    dateText: {
        fontSize: 16,
        color: COLORS.white,
    },
    saveButton: {
        backgroundColor: COLORS.blue500,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 12,
    },
    saveButtonDisabled: {
        opacity: 0.6,
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.white,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    switchInfo: {
        flex: 1,
        marginRight: 16,
    },
    switchLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.white,
        marginBottom: 4,
    },
    switchSubtext: {
        fontSize: 12,
        color: COLORS.zinc400,
    },
    toast: {
        position: 'absolute',
        top: -60,
        left: 20,
        right: 20,
        backgroundColor: COLORS.green500,
        padding: 12,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 100,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        gap: 8,
    },
    toastError: {
        backgroundColor: COLORS.red500,
    },
    toastText: {
        color: COLORS.white,
        fontWeight: '600',
        fontSize: 14,
    },
});
