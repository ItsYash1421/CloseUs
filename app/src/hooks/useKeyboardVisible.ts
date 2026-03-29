import { useState, useEffect } from 'react';
import { Keyboard, Platform } from 'react-native';

export const useKeyboardVisible = () => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showListener = Keyboard.addListener(showEvent, () =>
      setKeyboardVisible(true),
    );
    const hideListener = Keyboard.addListener(hideEvent, () =>
      setKeyboardVisible(false),
    );

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  return isKeyboardVisible;
};
