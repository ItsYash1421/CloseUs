import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '../../constants/colors';
import THEME from '../../constants/theme';
import { Message, User } from '../../types';
import { format } from 'date-fns';
import socketService from '../../services/socketService';

const MaleLogo = require('../../assets/images/Logo-Male-2.png');
const FemaleLogo = require('../../assets/images/Logo-Female-2.png');

interface MessageBubbleProps {
  message: Message;
  isMe: boolean;
  showAvatar: boolean;
  showTime: boolean;
  partner: User | null;
  currentUser: User | null;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isMe,
  showAvatar,
  showTime,
  partner,
  currentUser,
}) => {
  const hasMarkedAsRead = useRef(false);

  // Mark partner's message as read when it appears on screen
  useEffect(() => {
    if (!isMe && !message.isRead && !hasMarkedAsRead.current) {
      hasMarkedAsRead.current = true;
      // Delay to ensure message is visible
      setTimeout(() => {
        socketService.markMessageAsRead(message._id);
      }, 500);
    }
  }, [isMe, message._id, message.isRead]);

  return (
    <View style={[styles.messageRow, isMe ? styles.rowMe : styles.rowPartner]}>
      {/* Partner Avatar (Only for partner messages) */}
      {!isMe && (
        <View style={styles.messageAvatarContainer}>
          {showAvatar &&
            (partner?.photoUrl ? (
              <Image
                source={{ uri: partner.photoUrl }}
                style={styles.smallAvatar}
              />
            ) : (
              <Image
                source={partner?.gender === 'female' ? FemaleLogo : MaleLogo}
                style={styles.smallAvatar}
              />
            ))}
        </View>
      )}

      {/* Message Bubble with Time Below */}
      <View style={styles.messageContainer}>
        {/* Message Bubble */}
        {isMe ? (
          <LinearGradient
            colors={['#FF6B9D', '#C2185B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.messageBubble, styles.myMessage]}
          >
            <Text style={styles.myMessageText}>{message.content}</Text>
          </LinearGradient>
        ) : (
          <View style={[styles.messageBubble, styles.partnerMessage]}>
            <Text style={styles.partnerMessageText}>{message.content}</Text>
          </View>
        )}

        {/* Time Below Bubble - Only show if showTime is true */}
        {showTime && (
          <Text
            style={[
              styles.messageTime,
              isMe ? styles.myMessageTime : styles.partnerMessageTime,
            ]}
          >
            {format(new Date(message.createdAt), 'HH:mm')}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageRow: {
    flexDirection: 'row',
    marginBottom: 4,
    alignItems: 'flex-end',
  },
  rowMe: {
    justifyContent: 'flex-end',
  },
  rowPartner: {
    justifyContent: 'flex-start',
  },
  messageAvatarContainer: {
    width: 32,
    height: 32,
    marginRight: 8,
    marginLeft: 8,
    marginBottom: 4,
  },
  messageContainer: {
    flexDirection: 'column',
    maxWidth: '75%',
    gap: 4,
  },
  smallAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  avatarPlaceholder: {
    backgroundColor: COLORS.glass,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallAvatarText: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  messageBubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  myMessage: {
    borderBottomRightRadius: 4,
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  partnerMessage: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  messageText: {
    fontSize: THEME.fontSizes.md,
    lineHeight: 20,
  },
  myMessageText: {
    color: COLORS.white,
    fontSize: THEME.fontSizes.md,
    lineHeight: 20,
    fontWeight: '500',
  },
  partnerMessageText: {
    color: COLORS.white,
    fontSize: THEME.fontSizes.md,
    lineHeight: 20,
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
    paddingHorizontal: 4,
  },
  myMessageTime: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  partnerMessageTime: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-start',
    marginLeft: 8,
    color: 'rgba(255, 255, 255, 0.5)',
  },
});
