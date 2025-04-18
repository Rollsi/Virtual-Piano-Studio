import React from 'react';
import { Volume2, Music4, SwordIcon as Record, Timer, Settings } from 'lucide-react';

interface ControlPanelProps {
  volume: number;
  reverb: number;
  isRecording: boolean;
  bpm: number;
  isMetronomeOn: boolean;
  selectedSound: string;
  onVolumeChange: (value: number) => void;
  onReverbChange: (value: number) => void;
  onRecordingToggle: (value: boolean) => void;
  onBpmChange: (value: number) => void;
  onMetronomeToggle: (value: boolean) => void;
  onSoundChange: (value: string) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  volume,
  reverb,
  isRecording,
  bpm,
  isMetronomeOn,
  selectedSound,
  onVolumeChange,
  onReverbChange,
  onRecordingToggle,
  onBpmChange,
  onMetronomeToggle,
  onSoundChange,
}) => {
  return (
    <div className="bg-gray-900/50 border-b border-gray-700 p-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Volume Control */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-400 flex items-center gap-2">
            <Volume2 size={16} /> Volume
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="w-full accent-amber-500"
          />
        </div>

        {/* Reverb Control */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-400 flex items-center gap-2">
            <Music4 size={16} /> Reverb
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={reverb}
            onChange={(e) => onReverbChange(parseFloat(e.target.value))}
            className="w-full accent-amber-500"
          />
        </div>

        {/* Sound Selection */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-400 flex items-center gap-2">
            <Settings size={16} /> Sound
          </label>
          <select
            value={selectedSound}
            onChange={(e) => onSoundChange(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm"
          >
            <option value="grand">Grand Piano</option>
            <option value="bright">Bright Piano</option>
            <option value="upright">Upright Piano</option>
          </select>
        </div>

        {/* Recording Control */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-400 flex items-center gap-2">
            <Record size={16} /> Recording
          </label>
          <button
            onClick={() => onRecordingToggle(!isRecording)}
            className={`px-4 py-1 rounded text-sm font-medium transition-colors ${
              isRecording
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {isRecording ? 'Stop' : 'Record'}
          </button>
        </div>

        {/* Metronome Control */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-400 flex items-center gap-2">
            <Timer size={16} /> Metronome
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              min="40"
              max="208"
              value={bpm}
              onChange={(e) => onBpmChange(parseInt(e.target.value))}
              className="w-16 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm"
            />
            <button
              onClick={() => onMetronomeToggle(!isMetronomeOn)}
              className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
                isMetronomeOn
                  ? 'bg-amber-500 hover:bg-amber-600'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {isMetronomeOn ? 'On' : 'Off'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;