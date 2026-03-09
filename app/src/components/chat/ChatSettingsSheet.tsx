import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { BottomSheet } from '../common/BottomSheet';
import { COLORS } from '../../constants/colors';
import THEME from '../../constants/theme';
import { useChatStore } from '../../store/chatStore';

interface ChatSettingsSheetProps {
  visible: boolean;
  onClose: () => void;
}

export const ChatSettingsSheet: React.FC<ChatSettingsSheetProps> = ({
  visible,
  onClose,
}) => {
  const { chatSettings, updateChatSettings, isLoading } = useChatStore();

  const [deleteAfterSeen, setDeleteAfterSeen] = useState(
    chatSettings?.deleteAfterSeen || false,
  );
  const [deleteAfter12Hours, setDeleteAfter12Hours] = useState(
    chatSettings?.deleteAfter12Hours || false,
  );

  useEffect(() => {
    if (visible && chatSettings) {
      setDeleteAfterSeen(chatSettings.deleteAfterSeen || false);
      setDeleteAfter12Hours(chatSettings.deleteAfter12Hours || false);
    }
  }, [visible, chatSettings]);

  const handleToggleDeleteAfterSeen = async (value: boolean) => {
    // If trying to turn off and other is also off, don't allow
    if (!value && !deleteAfter12Hours) {
      return;
    }

    const previousValue = deleteAfterSeen;
    setDeleteAfterSeen(value);
    
    try {
      // If turning on, turn off the other setting
      if (value) {
        await updateChatSettings({ deleteAfterSeen: true, deleteAfter12Hours: false });
        setDeleteAfter12Hours(false);
      } else {
        await updateChatSettings({ deleteAfterSeen: false });
      }
    } catch (error) {
      console.error('Failed to update chat settings:', error);
      setDeleteAfterSeen(previousValue);
    }
  };

  const handleToggleDelete12Hours = async (value: boolean) => {
    // If trying to turn off and other is also off, don't allow
    if (!value && !deleteAfterSeen) {
      return;
    }

    const previousValue = deleteAfter12Hours;
    setDeleteAfter12Hours(value);
    
    try {
      // If turning on, turn off the other setting
      if (value) {
        await updateChatSettings({ deleteAfter12Hours: true, deleteAfterSeen: false });
        setDeleteAfterSeen(false);
      } else {
        await updateChatSettings({ deleteAfter12Hours: false });
      }
    } catch (error) {
      console.error('Failed to update chat settings:', error);
      setDeleteAfter12Hours(previousValue);
    }
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Chat Settings"
      height={300}
    >
      <View style={styles.container}>
        {/* Delete After Seen Toggle */}
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Delete After Seen</Text>
            <Text style={styles.settingSubtext}>
              Messages delete when your partner reads them
            </Text>
          </View>
          {isLoading ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <Switch
              value={deleteAfterSeen}
              onValueChange={handleToggleDeleteAfterSeen}
              trackColor={{ false: '#3e3e3e', true: COLORS.primary }}
              thumbColor={deleteAfterSeen ? COLORS.white : '#f4f3f4'}
            />
          )}
        </View>

        {/* Delete After 12 Hours Toggle */}
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Delete After 12 Hours</Text>
            <Text style={styles.settingSubtext}>
              Messages delete 12 hours after sending
            </Text>
          </View>
          {isLoading ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <Switch
              value={deleteAfter12Hours}
              onValueChange={handleToggleDelete12Hours}
              trackColor={{ false: '#3e3e3e', true: COLORS.primary }}
              thumbColor={deleteAfter12Hours ? COLORS.white : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
            />
          )}
        </View>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingInfo: {
    flex: 1,
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.white,
    marginBottom: 4,
  },
  settingSubtext: {
    fontSize: 13,
    color: COLORS.zinc400,
    lineHeight: 18,
  },
});