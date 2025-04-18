import React, { useState } from 'react';

interface PianoKeyProps {
  note: string;
  type: 'white' | 'black';
  playNote: (note: string) => void;
  stopNote: (note: string) => void;
  isActive?: boolean;
  keyLabel?: string;
}

const PianoKey: React.FC<PianoKeyProps> = ({ 
  note, 
  type, 
  playNote, 
  stopNote, 
  isActive = false,
  keyLabel
}) => {
  const [isPressed, setIsPressed] = useState(false);
  
  const handleMouseDown = () => {
    setIsPressed(true);
    playNote(note);
  };
  
  const handleMouseUp = () => {
    setIsPressed(false);
    stopNote(note);
  };
  
  const handleMouseLeave = () => {
    if (isPressed) {
      setIsPressed(false);
      stopNote(note);
    }
  };

  const whiteKeyClass = `
    relative h-48 w-14 
    border-l border-r border-b border-gray-300
    rounded-b-lg
    bg-gradient-to-b from-white to-gray-50
    shadow-[inset_0_-3px_6px_rgba(0,0,0,0.1)]
    transition-all duration-150 ease-out
    ${isPressed || isActive ? 'bg-gradient-to-b from-gray-100 to-white transform translate-y-1 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.08)]' : ''}
    first:rounded-bl-xl last:rounded-br-xl
    before:absolute before:inset-x-0 before:top-0 before:h-2/3 before:bg-gradient-to-b before:from-white before:to-transparent before:opacity-40
  `;
  
  const blackKeyClass = `
    absolute h-32 w-8 -ml-4 z-10
    bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900
    border-l border-r border-b border-gray-900
    rounded-b-lg
    shadow-[0_4px_8px_rgba(0,0,0,0.5),inset_0_-2px_6px_rgba(255,255,255,0.1)]
    transition-all duration-150 ease-out
    ${isPressed || isActive ? 'from-gray-800 via-gray-700 to-gray-800 transform translate-y-1 shadow-[0_2px_4px_rgba(0,0,0,0.4)]' : ''}
    before:absolute before:inset-x-0 before:top-0 before:h-1/2 before:bg-gradient-to-b before:from-gray-800 before:to-transparent before:opacity-20
  `;

  return (
    <div
      className={type === 'white' ? whiteKeyClass : blackKeyClass}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={(e) => {
        e.preventDefault();
        handleMouseDown();
      }}
      onTouchEnd={(e) => {
        e.preventDefault();
        handleMouseUp();
      }}
    >
      <div className={`absolute bottom-4 left-0 right-0 text-center select-none pointer-events-none
        ${type === 'white' ? 'text-gray-400' : 'text-gray-500'}`}>
        <span className="text-[10px] font-medium">{keyLabel}</span>
        <span className="block text-[8px] opacity-60">{note}</span>
      </div>
    </div>
  );
};

export default PianoKey;