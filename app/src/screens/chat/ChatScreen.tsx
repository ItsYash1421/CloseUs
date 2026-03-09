import React, { useEffect, useState, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Platform, ImageBackground, Image, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GradientBackground } from '../../components/common';
import { ChatHeader } from '../../components/chat/ChatHeader';
import { MessageBubble } from '../../components/chat/MessageBubble';
import { ChatInput } from '../../components/chat/ChatInput';
import { ChatSettingsSheet } from '../../components/chat/ChatSettingsSheet';
import THEME from '../../constants/theme';
import { useChatStore } from '../../store/chatStore';
import { useAuthStore } from '../../store/authStore';
import { useCoupleStore } from '../../store/coupleStore';
import { Message } from '../../types';
import notificationService from '../../services/notificationService';
import reminderService from '../../services/reminderService';
import { setKeyboardMode } from '../../utils/keyboardMode';

// Background images for different times of day
const NightChat = require('../../assets/images/NightChat.png');
const DayChat = require('../../assets/images/Day-Chat.png');
const SunsetChat = require('../../assets/images/Sunset-Chat.png');

// Get background image based on current time
const getTimeBasedBackground = () => {
  const hour = new Date().getHours();
  
  // Morning/Day: 6 AM - 5 PM
  if (hour >= 6 && hour < 17) {
    return DayChat;
  }
  // Evening/Sunset: 5 PM - 8 PM
  else if (hour >= 17 && hour < 20) {
    return SunsetChat;
  }
  // Night: 8 PM - 6 AM
  else {
    return NightChat;
  }
};

export const ChatScreen = () => {
  const [inputText, setInputText] = useState('');
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();
  const user = useAuthStore(state => state.user);
  const { partner, partnerIsOnline } = useCoupleStore();
  const {
    messages,
    isTyping,
    isConnected,
    hasMore,
    page,
    loadMessages,
    sendTextMessage,
    connectSocket,
    loadChatSettings,
  } = useChatStore();

  // Get time-based background image (memoized to avoid recalculating on every render)
  const backgroundImage = useMemo(() => getTimeBasedBackground(), []);
  
  // Calculate header height dynamically (insets.top + paddingTop + paddingBottom + content)
  const headerHeight = insets.top + 0 + 0 + 70; // matches ChatHeader padding and content + extra space

  useEffect(() => {
    // Set keyboard mode to adjustResize for chat screen
    setKeyboardMode('adjustResize');

    // Don't await - let screen render immediately
    loadMessages(1);
    loadChatSettings();
    connectSocket();

    // Notify backend that chat is opened (to delete old read messages)
    import('../../services/socketService').then(({ default: socketService }) => {
      socketService.notifyChatOpened();
    });

    // Clear badge and cancel inactivity reminder when viewing chat
    notificationService.clearBadge();
    reminderService.cancelInactivityReminder();

    // Reset to adjustPan and notify chat closed when leaving
    return () => {
      setKeyboardMode('adjustPan');
      // Notify backend that chat screen is closed
      import('../../services/socketService').then(({ default: socketService }) => {
        socketService.notifyChatClosed();
      });
    };
  }, []);

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      await loadMessages(page + 1);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleSend = () => {
    const textToSend = inputText.trim();
    if (textToSend) {
      // 1. Clear input immediately for instant UI feedback
      setInputText('');

      // 2. Schedule the heavy lifting (store update/socket) for the next frame
      // This prevents the keypress/touch from dropping a frame due to synchronous storage/logic
      requestAnimationFrame(() => {
        sendTextMessage(textToSend);
      });
    }
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    console.log('Message:', {
      messageId: item._id,
      senderId: item.senderId,
      userId: user?._id,
      isMe: item.senderId === user?._id,
    });

    // Handle both populated senderId (object) and non-populated (string)
    const senderId =
      typeof item.senderId === 'string'
        ? item.senderId
        : (item.senderId as any)?._id || (item.senderId as any)?.id;

    const isMe = senderId === user?._id;

    // Show avatar with every message
    const showAvatar = true;

    // For INVERTED FlatList:
    // - Index 0 = Newest message (bottom of screen)
    // - Index - 1 = Previous message (below current on screen, newer in time)
    // Show time only if:
    // 1. It's the newest message (index === 0), OR
    // 2. Previous message (index - 1) is from different sender, OR
    // 3. Previous message is more than 1 minute apart
    const prevMessage = index > 0 ? messages[index - 1] : null;
    const showTime =
      !prevMessage ||
      (typeof prevMessage.senderId === 'string'
        ? prevMessage.senderId
        : (prevMessage.senderId as any)?._id ||
        (prevMessage.senderId as any)?.id) !== senderId ||
      new Date(item.createdAt).getTime() -
      new Date(prevMessage.createdAt).getTime() >
      60000;

    return (
      <MessageBubble
        message={item}
        isMe={isMe}
        showAvatar={showAvatar}
        showTime={showTime}
        partner={partner}
        currentUser={user}
      />
    );
  };

  return (
    <View style={styles.mainContainer}>
      {/* Header stays on top */}
      <ChatHeader
        user={user}
        partner={partner}
        isOnline={partnerIsOnline}
        isConnected={isConnected}
        onOptions={() => setShowSettings(true)}
      />

      {/* Background Image with blur overlay - starts below header */}
      <View style={[styles.backgroundContainer, { top: headerHeight }]}>
        <Image
          source={backgroundImage}
          style={styles.backgroundImage}
          resizeMode="cover"
          blurRadius={Platform.OS === 'ios' ? 8 : 3}
        />
        <View style={styles.blurOverlay} />
      </View>

      <View style={styles.container}>
        {/* Loading State - Show loader during initial load */}
        {messages.length === 0 && isConnected === false ? (
          <View style={styles.centerLoader}>
            <Text style={styles.loadingText}>Loading messages...</Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item, index) => `${item._id}-${index}`}
            contentContainerStyle={styles.messagesList}
            showsVerticalScrollIndicator={false}
            inverted={true}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.1}
            ListFooterComponent={
              isLoadingMore ? (
                <View style={styles.loadingMore}>
                  <Text style={styles.loadingText}>Loading...</Text>
                </View>
              ) : null
            }
          />
        )}

        {/* Typing Indicator */}
        {isTyping && (
          <View style={styles.typingContainer}>
            <Text style={styles.typingText}>
              {partner?.name || 'Partner'} is typing...
            </Text>
          </View>
        )}
      </View>

      {/* Chat Input */}
      <ChatInput
        value={inputText}
        onChangeText={setInputText}
        onSend={handleSend}
        placeholder="Type a message..."
        maxLength={500}
      />

      {/* Chat Settings Sheet */}
      <ChatSettingsSheet
        visible={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  container: {
    flex: 1,
  },
  messagesList: {
    paddingHorizontal: THEME.spacing.md,
    paddingTop: 80,
    paddingBottom: 20,
    gap: 2,
  },
  typingContainer: {
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.sm,
  },
  typingText: {
    fontSize: THEME.fontSizes.sm,
    color: 'rgba(255, 255, 255, 0.6)',
    fontStyle: 'italic',
  },
  loadingMore: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  loadingText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: THEME.fontSizes.sm,
  },
  centerLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
