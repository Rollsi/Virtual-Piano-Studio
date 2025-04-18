import React from 'react';
import { Music, Zap, Trophy, BarChart3 } from 'lucide-react';

interface GameInterfaceProps {
  score: number;
  combo: number;
  highestCombo: number;
  isPlaying: boolean;
  difficulty: string;
  onStartGame: () => void;
  onPauseGame: () => void;
  onChangeDifficulty: (difficulty: string) => void;
}

const GameInterface: React.FC<GameInterfaceProps> = ({
  score,
  combo,
  highestCombo,
  isPlaying,
  difficulty,
  onStartGame,
  onPauseGame,
  onChangeDifficulty,
}) => {
  return (
    <div className="p-4 md:p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 flex items-center">
          <Music className="mr-2 text-amber-600" /> Piano Maestro
        </h1>
        
        <div className="flex gap-4">
          <button
            onClick={() => isPlaying ? onPauseGame() : onStartGame()}
            className={`px-6 py-2 rounded-full font-medium transition-all 
            ${isPlaying 
              ? 'bg-red-100 text-red-700 hover:bg-red-200' 
              : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          
          <select
            value={difficulty}
            onChange={(e) => onChangeDifficulty(e.target.value)}
            className="rounded-full px-4 py-2 bg-blue-50 text-blue-700 border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
          <div className="text-xl font-medium text-gray-500 mb-1">Score</div>
          <div className="text-3xl font-bold text-gray-800">{score}</div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
          <div className="text-xl font-medium text-gray-500 mb-1 flex items-center">
            <Zap className="mr-1 text-amber-500" size={18} /> Current Combo
          </div>
          <div className="text-3xl font-bold text-gray-800">{combo}</div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
          <div className="text-xl font-medium text-gray-500 mb-1 flex items-center">
            <Trophy className="mr-1 text-amber-500" size={18} /> Best Combo
          </div>
          <div className="text-3xl font-bold text-gray-800">{highestCombo}</div>
        </div>
      </div>
      
      <div className="text-center mb-4">
        <div className="inline-flex items-center bg-blue-50 px-4 py-2 rounded-full text-blue-700">
          <BarChart3 className="mr-2" size={18} />
          <span className="font-medium">Difficulty: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</span>
        </div>
      </div>
    </div>
  );
};

export default GameInterface;