import { NativeModules, Platform } from 'react-native';

interface KeyboardModuleInterface {
  setAdjustPan: () => void;
  setAdjustResize: () => void;
  setAdjustNothing: () => void;
}

const KeyboardModule: KeyboardModuleInterface | null =
  Platform.OS === 'android' ? NativeModules.KeyboardModule : null;

export type KeyboardMode = 'adjustPan' | 'adjustResize' | 'adjustNothing';

export const setKeyboardMode = (mode: KeyboardMode) => {
  if (!KeyboardModule || Platform.OS !== 'android') {
    return;
  }

  switch (mode) {
    case 'adjustPan':
      KeyboardModule.setAdjustPan();
      break;
    case 'adjustResize':
      KeyboardModule.setAdjustResize();
      break;
    case 'adjustNothing':
      KeyboardModule.setAdjustNothing();
      break;
  }
};

export default {
  setKeyboardMode,
};
