import React, { useEffect, useState } from 'react';

interface Note {
  id: string;
  note: string;
  position: number; // 0-100% for horizontal position
  top: number; // for vertical position
  hit: boolean;
  missed: boolean;
}

interface FallingNotesProps {
  difficulty: string;
  isPlaying: boolean;
  onNoteHit: (note: string) => void;
  onNoteMiss: () => void;
  activeNotes: string[];
}

const FallingNotes: React.FC<FallingNotesProps> = ({
  difficulty,
  isPlaying,
  onNoteHit,
  onNoteMiss,
  activeNotes,
}) => {
  const [notes, setNotes] = useState<Note[]>([]);
  
  // Speed based on difficulty
  const getSpeed = () => {
    switch (difficulty) {
      case 'easy': return 1;
      case 'medium': return 2;
      case 'hard': return 3;
      default: return 1;
    }
  };
  
  // Generate notes at random intervals
  useEffect(() => {
    if (!isPlaying) return;
    
    const allNotes = [
      'C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3',
      'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4',
      'C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5'
    ];
    
    // Also include black keys for medium and hard difficulties
    if (difficulty !== 'easy') {
      allNotes.push(
        'C#3', 'D#3', 'F#3', 'G#3', 'A#3',
        'C#4', 'D#4', 'F#4', 'G#4', 'A#4',
        'C#5', 'D#5', 'F#5', 'G#5', 'A#5'
      );
    }
    
    // Determine interval based on difficulty
    const interval = difficulty === 'easy' ? 2000 : 
                    difficulty === 'medium' ? 1500 : 1000;
    
    const generateNote = () => {
      const randomNote = allNotes[Math.floor(Math.random() * allNotes.length)];
      const position = calculatePositionForNote(randomNote);
      
      setNotes(prev => [...prev, {
        id: `note-${Date.now()}-${Math.random()}`,
        note: randomNote,
        position,
        top: 0,
        hit: false,
        missed: false
      }]);
    };
    
    const noteTimer = setInterval(generateNote, interval);
    return () => clearInterval(noteTimer);
  }, [isPlaying, difficulty]);
  
  // Move notes down
  useEffect(() => {
    if (!isPlaying) return;
    
    const speed = getSpeed();
    const moveInterval = 16; // ~60fps
    
    const moveNotes = () => {
      setNotes(prev => prev.map(note => ({
        ...note,
        top: note.top + speed,
        // Mark as missed if it goes past bottom
        missed: note.top > 95 && !note.hit ? true : note.missed
      })));
    };
    
    const animationTimer = setInterval(moveNotes, moveInterval);
    return () => clearInterval(animationTimer);
  }, [isPlaying, difficulty]);
  
  // Check for hits and clean up missed/hit notes
  useEffect(() => {
    // Check if any active notes match with falling notes at the bottom
    if (activeNotes.length > 0) {
      setNotes(prev => prev.map(note => {
        // If note is in hit zone (85-95%) and being played
        if (note.top >= 85 && note.top <= 95 && activeNotes.includes(note.note) && !note.hit) {
          onNoteHit(note.note);
          return { ...note, hit: true };
        }
        return note;
      }));
    }
    
    // Cleanup missed notes
    setNotes(prev => {
      const updatedNotes = prev.filter(note => {
        if (note.missed && !note.hit) {
          onNoteMiss();
          return false; // Remove missed notes
        }
        if (note.hit && note.top > 100) {
          return false; // Remove hit notes that are off screen
        }
        return true;
      });
      return updatedNotes;
    });
  }, [activeNotes, notes, onNoteHit, onNoteMiss]);
  
  // Calculate horizontal position based on the note
  const calculatePositionForNote = (note: string) => {
    // Extract the note name and octave
    const noteName = note.replace(/[0-9]/g, '');
    const octave = parseInt(note.replace(/[^0-9]/g, ''), 10);
    
    // All possible notes in order
    const allNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    
    // Calculate position based on note and octave
    const noteIndex = allNotes.indexOf(noteName);
    const position = ((octave - 3) * 12 + noteIndex) / 36 * 100; // 3 octaves = 36 semitones
    
    return position;
  };
  
  return (
    <div className="relative h-96 w-full bg-gradient-to-b from-indigo-50 to-blue-100 overflow-hidden rounded-t-xl border-t border-x border-gray-200">
      {notes.map(note => (
        <div
          key={note.id}
          className={`absolute w-12 h-16 transform -translate-x-1/2 transition-colors duration-300 flex items-center justify-center
            ${note.hit ? 'bg-green-400 text-white' : 
              note.note.includes('#') ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}
            ${note.hit ? 'opacity-50' : 'opacity-90'}
            rounded-md shadow-md`}
          style={{
            left: `${note.position}%`,
            top: `${note.top}%`,
            transform: `translateX(-50%) ${note.hit ? 'scale(1.2)' : ''}`,
          }}
        >
          <span className="font-serif font-medium">{note.note}</span>
        </div>
      ))}
      
      {/* Hit zone indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 opacity-80"></div>
    </div>
  );
};

export default FallingNotes;