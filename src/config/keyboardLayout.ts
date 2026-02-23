/**
 * Keyboard Layout Configuration
 * Based on standard Windows keyboard layout with scancode mappings
 */

export interface KeyConfig {
  id: string;
  label: string;
  scancode: number;
  width: 'normal' | 'wide' | 'wide2' | 'shift' | 'space';
  category?: string;
}

export interface KeyboardLayoutConfig {
  functionRow: KeyConfig[];
  numberRow: KeyConfig[];
  qwertyRow: KeyConfig[];
  asdfRow: KeyConfig[];
  zxcvRow: KeyConfig[];
  bottomRow: KeyConfig[];
}

export const keyboardLayout: KeyboardLayoutConfig = {
  functionRow: [
    { id: 'Esc', label: 'Esc', scancode: 1, width: 'normal', category: 'special' },
    { id: 'F1', label: 'F1', scancode: 59, width: 'normal', category: 'function' },
    { id: 'F2', label: 'F2', scancode: 60, width: 'normal', category: 'function' },
    { id: 'F3', label: 'F3', scancode: 61, width: 'normal', category: 'function' },
    { id: 'F4', label: 'F4', scancode: 62, width: 'normal', category: 'function' },
    { id: 'F5', label: 'F5', scancode: 63, width: 'normal', category: 'function' },
    { id: 'F6', label: 'F6', scancode: 64, width: 'normal', category: 'function' },
    { id: 'F7', label: 'F7', scancode: 65, width: 'normal', category: 'function' },
    { id: 'F8', label: 'F8', scancode: 66, width: 'normal', category: 'function' },
    { id: 'F9', label: 'F9', scancode: 67, width: 'normal', category: 'function' },
    { id: 'F10', label: 'F10', scancode: 68, width: 'normal', category: 'function' },
    { id: 'F11', label: 'F11', scancode: 87, width: 'normal', category: 'function' },
    { id: 'F12', label: 'F12', scancode: 88, width: 'normal', category: 'function' },
    { id: 'Delete', label: 'Del', scancode: 83, width: 'normal', category: 'special' },
  ],

  numberRow: [
    { id: '`', label: '~`', scancode: 41, width: 'normal', category: 'special' },
    { id: '1', label: '!1', scancode: 2, width: 'normal', category: 'number' },
    { id: '2', label: '@2', scancode: 3, width: 'normal', category: 'number' },
    { id: '3', label: '#3', scancode: 4, width: 'normal', category: 'number' },
    { id: '4', label: '$4', scancode: 5, width: 'normal', category: 'number' },
    { id: '5', label: '%5', scancode: 6, width: 'normal', category: 'number' },
    { id: '6', label: '^6', scancode: 7, width: 'normal', category: 'number' },
    { id: '7', label: '&7', scancode: 8, width: 'normal', category: 'number' },
    { id: '8', label: '*8', scancode: 9, width: 'normal', category: 'number' },
    { id: '9', label: '(9', scancode: 10, width: 'normal', category: 'number' },
    { id: '0', label: ')0', scancode: 11, width: 'normal', category: 'number' },
    { id: '-', label: '_-', scancode: 12, width: 'normal', category: 'special' },
    { id: '=', label: '+=', scancode: 13, width: 'normal', category: 'special' },
    { id: 'Backspace', label: 'Backspace', scancode: 14, width: 'wide2', category: 'special' },
  ],

  qwertyRow: [
    { id: 'Tab', label: 'Tab', scancode: 15, width: 'wide', category: 'special' },
    { id: 'Q', label: 'Q', scancode: 16, width: 'normal', category: 'letter' },
    { id: 'W', label: 'W', scancode: 17, width: 'normal', category: 'letter' },
    { id: 'E', label: 'E', scancode: 18, width: 'normal', category: 'letter' },
    { id: 'R', label: 'R', scancode: 19, width: 'normal', category: 'letter' },
    { id: 'T', label: 'T', scancode: 20, width: 'normal', category: 'letter' },
    { id: 'Y', label: 'Y', scancode: 21, width: 'normal', category: 'letter' },
    { id: 'U', label: 'U', scancode: 22, width: 'normal', category: 'letter' },
    { id: 'I', label: 'I', scancode: 23, width: 'normal', category: 'letter' },
    { id: 'O', label: 'O', scancode: 24, width: 'normal', category: 'letter' },
    { id: 'P', label: 'P', scancode: 25, width: 'normal', category: 'letter' },
    { id: '[', label: '{[', scancode: 26, width: 'normal', category: 'special' },
    { id: ']', label: '}]', scancode: 27, width: 'normal', category: 'special' },
    { id: '\\', label: '|\\', scancode: 43, width: 'wide', category: 'special' },
  ],

  asdfRow: [
    { id: 'CapsLock', label: 'Caps', scancode: 58, width: 'wide', category: 'special' },
    { id: 'A', label: 'A', scancode: 30, width: 'normal', category: 'letter' },
    { id: 'S', label: 'S', scancode: 31, width: 'normal', category: 'letter' },
    { id: 'D', label: 'D', scancode: 32, width: 'normal', category: 'letter' },
    { id: 'F', label: 'F', scancode: 33, width: 'normal', category: 'letter' },
    { id: 'G', label: 'G', scancode: 34, width: 'normal', category: 'letter' },
    { id: 'H', label: 'H', scancode: 35, width: 'normal', category: 'letter' },
    { id: 'J', label: 'J', scancode: 36, width: 'normal', category: 'letter' },
    { id: 'K', label: 'K', scancode: 37, width: 'normal', category: 'letter' },
    { id: 'L', label: 'L', scancode: 38, width: 'normal', category: 'letter' },
    { id: ';', label: ':;', scancode: 39, width: 'normal', category: 'special' },
    { id: "'", label: '"\' ', scancode: 40, width: 'normal', category: 'special' },
    { id: 'Enter', label: 'Enter', scancode: 28, width: 'wide2', category: 'special' },
  ],

  zxcvRow: [
    { id: 'LeftShift', label: 'Shift', scancode: 42, width: 'shift', category: 'modifier' },
    { id: 'Z', label: 'Z', scancode: 44, width: 'normal', category: 'letter' },
    { id: 'X', label: 'X', scancode: 45, width: 'normal', category: 'letter' },
    { id: 'C', label: 'C', scancode: 46, width: 'normal', category: 'letter' },
    { id: 'V', label: 'V', scancode: 47, width: 'normal', category: 'letter' },
    { id: 'B', label: 'B', scancode: 48, width: 'normal', category: 'letter' },
    { id: 'N', label: 'N', scancode: 49, width: 'normal', category: 'letter' },
    { id: 'M', label: 'M', scancode: 50, width: 'normal', category: 'letter' },
    { id: ',', label: '<,', scancode: 51, width: 'normal', category: 'special' },
    { id: '.', label: '>.', scancode: 52, width: 'normal', category: 'special' },
    { id: '/', label: '?/', scancode: 53, width: 'normal', category: 'special' },
    { id: 'RightShift', label: 'Shift', scancode: 54, width: 'shift', category: 'modifier' },
  ],

  bottomRow: [
    { id: 'LeftCtrl', label: 'Ctrl', scancode: 29, width: 'wide', category: 'modifier' },
    { id: 'LeftWin', label: 'Win', scancode: 91, width: 'wide', category: 'modifier' },
    { id: 'LeftAlt', label: 'Alt', scancode: 56, width: 'wide', category: 'modifier' },
    { id: 'Space', label: 'Space', scancode: 57, width: 'space', category: 'special' },
    { id: 'RightAlt', label: 'Alt', scancode: 184, width: 'wide', category: 'modifier' },
    { id: 'RightWin', label: 'Win', scancode: 92, width: 'wide', category: 'modifier' },
    { id: 'RightCtrl', label: 'Ctrl', scancode: 157, width: 'wide', category: 'modifier' },
    { id: 'LeftArrow', label: '←', scancode: 75, width: 'normal', category: 'special' },
    { id: 'UpArrow', label: '↑', scancode: 72, width: 'normal', category: 'special' },
    { id: 'DownArrow', label: '↓', scancode: 80, width: 'normal', category: 'special' },
    { id: 'RightArrow', label: '→', scancode: 77, width: 'normal', category: 'special' },
  ],
};

/**
 * Get all keys as a flat array
 */
export const getAllKeys = (): KeyConfig[] => {
  return [
    ...keyboardLayout.functionRow,
    ...keyboardLayout.numberRow,
    ...keyboardLayout.qwertyRow,
    ...keyboardLayout.asdfRow,
    ...keyboardLayout.zxcvRow,
    ...keyboardLayout.bottomRow,
  ];
};

/**
 * Get key by scancode
 */
export const getKeyByScancode = (scancode: number): KeyConfig | undefined => {
  return getAllKeys().find(key => key.scancode === scancode);
};
