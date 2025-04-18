import React, { useState } from 'react';
import PianoKeyboard from './components/PianoKeyboard';
import ControlPanel from './components/ControlPanel';
import { useKeyboardInput } from './hooks/useKeyboardInput';
import { useAudioEngine } from './hooks/useAudioEngine';
import { Music } from 'lucide-react';

function App() {
  const [volume, setVolume] = useState(0.8);
  const [reverb, setReverb] = useState(0.2);
  const [isRecording, setIsRecording] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [isMetronomeOn, setIsMetronomeOn] = useState(false);
  const [selectedSound, setSelectedSound] = useState('grand');

  const { activeNotes } = useKeyboardInput();
  const { isInitialized, setAudioSettings } = useAudioEngine();

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    setAudioSettings({ volume: newVolume });
  };

  const handleReverbChange = (newReverb: number) => {
    setReverb(newReverb);
    setAudioSettings({ reverb: newReverb });
  };

  const handleSoundChange = (sound: string) => {
    setSelectedSound(sound);
    setAudioSettings({ instrument: sound });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-serif flex items-center gap-3">
            <Music className="text-amber-500" />
            Virtual Piano Studio
          </h1>
        </header>

        <div className="bg-gray-800/50 rounded-xl shadow-2xl overflow-hidden backdrop-blur-sm border border-gray-700">
          <ControlPanel
            volume={volume}
            reverb={reverb}
            isRecording={isRecording}
            bpm={bpm}
            isMetronomeOn={isMetronomeOn}
            selectedSound={selectedSound}
            onVolumeChange={handleVolumeChange}
            onReverbChange={handleReverbChange}
            onRecordingToggle={setIsRecording}
            onBpmChange={setBpm}
            onMetronomeToggle={setIsMetronomeOn}
            onSoundChange={handleSoundChange}
          />
          
          {isInitialized ? (
            <div className="p-8">
              <PianoKeyboard activeNotes={activeNotes} />
            </div>
          ) : (
            <div className="h-96 flex items-center justify-center">
              <button 
                className="px-8 py-4 bg-amber-500 text-gray-900 rounded-full font-medium hover:bg-amber-400 transition-colors"
                onClick={() => {}}
              >
                Click to Initialize Audio
              </button>
            </div>
          )}
          
          <div className="p-6 bg-gray-800/80 border-t border-gray-700">
            <h2 className="text-xl font-medium text-amber-500 mb-4">Keyboard Controls</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-gray-400 mb-2">Lower Octave (C3-B3)</h3>
                <p className="text-sm text-gray-500">Keys: Z,S,X,D,C,V,G,B,H,N,J,M</p>
              </div>
              <div>
                <h3 className="text-gray-400 mb-2">Middle Octave (C4-B4)</h3>
                <p className="text-sm text-gray-500">Keys: Q,2,W,3,E,R,5,T,6,Y,7,U</p>
              </div>
              <div>
                <h3 className="text-gray-400 mb-2">Upper Octave (C5-G5)</h3>
                <p className="text-sm text-gray-500">Keys: I,9,O,0,P,[,=,]</p>
              </div>
              <div>
                <h3 className="text-gray-400 mb-2">Additional Controls</h3>
                <p className="text-sm text-gray-500">
                  Space: Start/Stop Metronome<br />
                  R: Toggle Recording
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;