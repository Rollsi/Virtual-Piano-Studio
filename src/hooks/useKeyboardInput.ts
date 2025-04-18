import { useEffect, useState } from 'react';

interface KeyMap {
  [key: string]: string;
}

export const useKeyboardInput = () => {
  const [activeNotes, setActiveNotes] = useState<string[]>([]);

  useEffect(() => {
    // Keyboard mapping (computer keyboard to piano notes)
    const keyboardMap: KeyMap = {
      'z': 'C3', 's': 'C#3', 'x': 'D3', 'd': 'D#3', 'c': 'E3', 'v': 'F3',
      'g': 'F#3', 'b': 'G3', 'h': 'G#3', 'n': 'A3', 'j': 'A#3', 'm': 'B3',
      'q': 'C4', '2': 'C#4', 'w': 'D4', '3': 'D#4', 'e': 'E4', 'r': 'F4',
      '5': 'F#4', 't': 'G4', '6': 'G#4', 'y': 'A4', '7': 'A#4', 'u': 'B4',
      'i': 'C5', '9': 'C#5', 'o': 'D5', '0': 'D#5', 'p': 'E5', '[': 'F5',
      '=': 'F#5', ']': 'G5'
    };

    const pressedKeys = new Set<string>();

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      // Prevent key repeat and check if key is mapped
      if (pressedKeys.has(key) || !keyboardMap[key]) return;
      
      pressedKeys.add(key);
      const note = keyboardMap[key];
      
      setActiveNotes(prev => [...prev, note]);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      if (!keyboardMap[key]) return;
      
      pressedKeys.delete(key);
      const note = keyboardMap[key];
      
      setActiveNotes(prev => prev.filter(n => n !== note));
    };

    // Handle window blur to reset all keys
    const handleBlur = () => {
      pressedKeys.clear();
      setActiveNotes([]);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  return { activeNotes };
};

export default useKeyboardInput;