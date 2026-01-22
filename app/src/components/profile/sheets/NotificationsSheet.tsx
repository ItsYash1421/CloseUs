import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { BottomSheet } from '../../common/BottomSheet';
import { COLORS } from '../../../constants/colors';
import { preferencesService } from '../../../services/preferencesService';

interface NotificationsSheetProps {
  visible: boolean;
  onClose: () => void;
}

interface NotificationPrefs {
  pushEnabled: boolean;
  dailyReminders: boolean;
  partnerActivity: boolean;
  messages: boolean;
}

export const NotificationsSheet: React.FC<NotificationsSheetProps> = ({
  visible,
  onClose,
}) => {
  const [prefs, setPrefs] = useState<NotificationPrefs>({
    pushEnabled: true,
    dailyReminders: true,
    partnerActivity: true,
    messages: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastToggled, setLastToggled] = useState<
    keyof NotificationPrefs | null
  >(null);

  useEffect(() => {
    if (visible) {
      fetchPreferences();
    }
  }, [visible]);

  const fetchPreferences = async () => {
    setIsLoading(true);
    try {
      const data = await preferencesService.getNotificationPreferences();
      if (data) {
        setPrefs(data);
      }
    } catch (error) {
      console.error('Failed to fetch preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (key: keyof NotificationPrefs, value: boolean) => {
    const newPrefs = { ...prefs, [key]: value };

    // If master toggle is off, disable all
    if (key === 'pushEnabled' && !value) {
      newPrefs.dailyReminders = false;
      newPrefs.partnerActivity = false;
      newPrefs.messages = false;
    }

    setPrefs(newPrefs);
    setIsSaving(true);
    setLastToggled(key);

    try {
      await preferencesService.updateNotificationPreferences(newPrefs);
    } catch (error) {
      Alert.alert('Error', 'Failed to save preferences');
      // Revert on error
      setPrefs(prefs);
    } finally {
      setIsSaving(false);
      setLastToggled(null);
    }
  };

  const ToggleItem = ({
    label,
    description,
    value,
    onValueChange,
    disabled = false,
    loading = false,
  }: {
    label: string;
    description: string;
    value: boolean;
    onValueChange: (val: boolean) => void;
    disabled?: boolean;
    loading?: boolean;
  }) => (
    <View style={[styles.toggleItem, disabled && styles.toggleItemDisabled]}>
      <View style={styles.toggleInfo}>
        <Text style={[styles.toggleLabel, disabled && styles.textDisabled]}>
          {label}
        </Text>
        <Text
          style={[styles.toggleDescription, disabled && styles.textDisabled]}
        >
          {description}
        </Text>
      </View>
      {loading ? (
        <ActivityIndicator color={COLORS.blue400} size="small" />
      ) : (
        <Switch
          value={value}
          onValueChange={onValueChange}
          disabled={disabled}
          trackColor={{ false: '#3e3e3e', true: COLORS.blue500 }}
          thumbColor={value ? COLORS.white : '#f4f3f4'}
        />
      )}
    </View>
  );

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Notifications"
      height={450}
      scrollEnabled={false}
    >
      <View style={styles.container}>
        {isLoading ? (
          <ActivityIndicator color={COLORS.blue400} size="large" />
        ) : (
          <>
            {/* Master Toggle */}
            <ToggleItem
              label="Push Notifications"
              description="Enable all push notifications"
              value={prefs.pushEnabled}
              onValueChange={val => handleToggle('pushEnabled', val)}
              loading={isSaving && lastToggled === 'pushEnabled'}
            />

            <View style={styles.divider} />

            {/* Individual Toggles */}
            <ToggleItem
              label="Daily Reminders"
              description="Get reminded to connect with your partner"
              value={prefs.dailyReminders}
              onValueChange={val => handleToggle('dailyReminders', val)}
              disabled={!prefs.pushEnabled}
              loading={isSaving && lastToggled === 'dailyReminders'}
            />

            <ToggleItem
              label="Partner Activity"
              description="When your partner answers questions or plays games"
              value={prefs.partnerActivity}
              onValueChange={val => handleToggle('partnerActivity', val)}
              disabled={!prefs.pushEnabled}
              loading={isSaving && lastToggled === 'partnerActivity'}
            />

            <ToggleItem
              label="Messages"
              description="Get notified about new messages"
              value={prefs.messages}
              onValueChange={val => handleToggle('messages', val)}
              disabled={!prefs.pushEnabled}
              loading={isSaving && lastToggled === 'messages'}
            />
          </>
        )}
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 10,
  },
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  toggleItemDisabled: {
    opacity: 0.5,
  },
  toggleInfo: {
    flex: 1,
    marginRight: 16,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: 4,
  },
  toggleDescription: {
    fontSize: 13,
    color: COLORS.zinc400,
  },
  textDisabled: {
    color: COLORS.zinc400,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 8,
  },
});
