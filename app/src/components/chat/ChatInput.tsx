import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Animated,
  Keyboard,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../constants/colors';
import THEME from '../../constants/theme';
import { BLUR_CONFIG } from '../../constants/blur';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const INPUT_BAR_WIDTH = SCREEN_WIDTH * 0.92;

interface ChatInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  placeholder?: string;
  maxLength?: number;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChangeText,
  onSend,
  placeholder = 'Type a message...',
  maxLength = 500,
}) => {
  const insets = useSafeAreaInsets();
  const [isFocused, setIsFocused] = useState(false);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const translateY = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = () => {
      Animated.spring(translateY, {
        toValue: 0,
        tension: 50,
        friction: 9,
        useNativeDriver: true,
      }).start();
    };

    const onHide = () => {
      Animated.spring(translateY, {
        toValue: 0,
        tension: 50,
        friction: 9,
        useNativeDriver: true,
      }).start();
    };

    const showListener = Keyboard.addListener(showEvent, onShow);
    const hideListener = Keyboard.addListener(hideEvent, onHide);

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleSend = () => {
    if (value.trim()) {
      onSend();
      handlePressOut();
    }
  };

  const canSend = value.trim().length > 0;

  return (
    <Animated.View 
      style={[
        styles.wrapper,
        {
          paddingBottom: insets.bottom + 10,
          transform: [{ translateY }],
        }
      ]}
    >
      <View style={styles.container}>
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType={BLUR_CONFIG.blurType}
          blurAmount={BLUR_CONFIG.blurAmount}
          reducedTransparencyFallbackColor={BLUR_CONFIG.fallbackColor}
        />
        
        {/* Dark tint overlay */}
        <View style={styles.tintOverlay} />
        
        {/* Border overlay */}
        <View style={styles.borderOverlay} />
      
      <View style={styles.content}>
        {/* Input Field */}
        <View
          style={[
            styles.inputContainer,
            isFocused && styles.inputContainerFocused,
          ]}
        >
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor={COLORS.textMuted}
            value={value}
            onChangeText={onChangeText}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            multiline
            maxLength={maxLength}
            textAlignVertical="center"
          />
        </View>

        {/* Send Button */}
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            onPress={handleSend}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={!canSend}
            activeOpacity={0.8}
          >
            {canSend ? (
              <LinearGradient
                colors={['#FF6B9D', '#C2185B']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.sendButton}
              >
                <Icon name="send" size={22} color={COLORS.white} />
              </LinearGradient>
            ) : (
              <View style={styles.sendButtonDisabled}>
                <Icon name="send" size={22} color={COLORS.textMuted} />
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    pointerEvents: 'box-none',
  },
  container: {
    width: INPUT_BAR_WIDTH,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
    pointerEvents: 'auto',
  },
  tintOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: BLUR_CONFIG.tints.none,
    pointerEvents: 'none',
  },
  borderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 30,
    ...BLUR_CONFIG.borders.medium,
    pointerEvents: 'none',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    gap: 10,
    minHeight: 60,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 44,
    maxHeight: 100,
    justifyContent: 'center',
  },
  inputContainerFocused: {
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  input: {
    fontSize: THEME.fontSizes.md,
    color: COLORS.white,
    padding: 0,
    margin: 0,
    lineHeight: 20,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  sendButtonDisabled: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
});
