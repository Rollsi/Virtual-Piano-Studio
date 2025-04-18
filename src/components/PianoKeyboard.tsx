import React from 'react';
import PianoKey from './PianoKey';
import { useAudioEngine } from '../hooks/useAudioEngine';

interface PianoKeyboardProps {
  activeNotes: string[];
}

const PianoKeyboard: React.FC<PianoKeyboardProps> = ({ activeNotes }) => {
  const { playNote, stopNote } = useAudioEngine();
  
  // Define piano notes and their corresponding keyboard keys
  const keyboardMap = {
    'z': 'C3', 's': 'C#3', 'x': 'D3', 'd': 'D#3', 'c': 'E3', 'v': 'F3',
    'g': 'F#3', 'b': 'G3', 'h': 'G#3', 'n': 'A3', 'j': 'A#3', 'm': 'B3',
    'q': 'C4', '2': 'C#4', 'w': 'D4', '3': 'D#4', 'e': 'E4', 'r': 'F4',
    '5': 'F#4', 't': 'G4', '6': 'G#4', 'y': 'A4', '7': 'A#4', 'u': 'B4',
    'i': 'C5', '9': 'C#5', 'o': 'D5', '0': 'D#5', 'p': 'E5', '[': 'F5',
    '=': 'F#5', ']': 'G5'
  };
  
  // Create reverse mapping for displaying key labels
  const noteToKey = Object.fromEntries(
    Object.entries(keyboardMap).map(([key, note]) => [note, key.toUpperCase()])
  );
  
  // Define piano notes for one octave
  const whiteKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const blackKeys = ['C#', 'D#', null, 'F#', 'G#', 'A#', null]; // null for positions without black keys

  // Create multiple octaves
  const octaves = [3, 4, 5]; // 3 octaves: C3-B5
  
  return (
    <div className="relative mx-auto max-w-5xl overflow-x-auto pb-8 px-4">
      <div className="flex justify-center">
        {octaves.map((octave) => (
          <div key={`octave-${octave}`} className="flex">
            {whiteKeys.map((note, i) => {
              const fullNote = `${note}${octave}`;
              return (
                <div key={fullNote} className="relative">
                  <PianoKey
                    note={fullNote}
                    type="white"
                    playNote={playNote}
                    stopNote={stopNote}
                    isActive={activeNotes.includes(fullNote)}
                    keyLabel={noteToKey[fullNote]}
                  />
                  {blackKeys[i] && (
                    <PianoKey
                      note={`${blackKeys[i]}${octave}`}
                      type="black"
                      playNote={playNote}
                      stopNote={stopNote}
                      isActive={activeNotes.includes(`${blackKeys[i]}${octave}`)}
                      keyLabel={noteToKey[`${blackKeys[i]}${octave}`]}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PianoKeyboard;