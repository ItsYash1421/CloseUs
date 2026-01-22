import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { GradientBackground, Avatar, Header } from '../../components/common';
import { COLORS } from '../../constants/colors';
import THEME from '../../constants/theme';
import { useChatStore } from '../../store/chatStore';
import { useAuthStore } from '../../store/authStore';
import { Message } from '../../types';
import { format } from 'date-fns';
import notificationService from '../../services/notificationService';
import reminderService from '../../services/reminderService';

export const ChatScreen = () => {
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const user = useAuthStore(state => state.user);
  const {
    messages,
    isTyping,
    isConnected,
    loadMessages,
    sendTextMessage,
    connectSocket,
  } = useChatStore();

  useEffect(() => {
    loadMessages();
    connectSocket();

    // Clear badge and cancel inactivity reminder when viewing chat
    notificationService.clearBadge();
    reminderService.cancelInactivityReminder();
  }, []);

  const handleSend = () => {
    if (inputText.trim()) {
      sendTextMessage(inputText.trim());
      setInputText('');
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMe = item.senderId === user?._id;
    return (
      <View
        style={[
          styles.messageBubble,
          isMe ? styles.myMessage : styles.partnerMessage,
        ]}
      >
        <Text style={styles.messageText}>{item.content}</Text>
        <Text style={styles.messageTime}>
          {format(new Date(item.createdAt), 'HH:mm')}
        </Text>
      </View>
    );
  };

  return (
    <GradientBackground variant="background">
      <Header title="Chat" showChat={false} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Connection Status */}
        <View
          style={[
            styles.connectionStatus,
            { padding: THEME.spacing.sm, justifyContent: 'center' },
          ]}
        >
          <View
            style={[
              styles.statusDot,
              { backgroundColor: isConnected ? COLORS.success : COLORS.error },
            ]}
          />
          <Text style={styles.statusText}>
            {isConnected ? 'Connected' : 'Connecting...'}
          </Text>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          showsVerticalScrollIndicator={false}
        />

        {/* Typing Indicator */}
        {isTyping && (
          <View style={styles.typingContainer}>
            <Text style={styles.typingText}>Partner is typing...</Text>
          </View>
        )}

        {/* Input */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.iconButtonText}>📷</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={COLORS.textMuted}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !inputText.trim() && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Text style={styles.sendButtonText}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: THEME.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: THEME.fontSizes.xxl,
    fontWeight: THEME.fontWeights.bold,
    color: COLORS.white,
    marginBottom: THEME.spacing.xs,
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.xs,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: THEME.fontSizes.xs,
    color: COLORS.textSecondary,
  },
  messagesList: {
    padding: THEME.spacing.lg,
    gap: THEME.spacing.sm,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.lg,
    marginBottom: THEME.spacing.xs,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.primary,
  },
  partnerMessage: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.glass,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  messageText: {
    fontSize: THEME.fontSizes.md,
    color: COLORS.white,
    marginBottom: THEME.spacing.xs,
  },
  messageTime: {
    fontSize: THEME.fontSizes.xs,
    color: COLORS.textSecondary,
    alignSelf: 'flex-end',
  },
  typingContainer: {
    padding: THEME.spacing.md,
  },
  typingText: {
    fontSize: THEME.fontSizes.sm,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: THEME.spacing.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.backgroundCard,
    gap: THEME.spacing.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonText: {
    fontSize: 24,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.glass,
    borderRadius: THEME.borderRadius.lg,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    fontSize: THEME.fontSizes.md,
    color: COLORS.white,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    fontSize: 20,
    color: COLORS.white,
  },
});
