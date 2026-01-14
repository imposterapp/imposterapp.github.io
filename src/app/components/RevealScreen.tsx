import { useEffect, useState } from 'react';
import { GameState } from '../App';
import { getRandomWord } from '../data/classicWords';
import { getRandomAthlete } from '../data/sportsAthletes';
import { Trophy, RotateCcw, Home } from 'lucide-react';

interface RevealScreenProps {
  gameState: GameState;
  onPlayAgain: (state: GameState) => void;
  onReturnToMenu: () => void;
}

export default function RevealScreen({ gameState, onPlayAgain, onReturnToMenu }: RevealScreenProps) {
  const [confetti, setConfetti] = useState<Array<{ id: number; left: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    // Spawn confetti
    const pieces: typeof confetti = [];
    for (let i = 0; i < 50; i++) {
      pieces.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 1.5,
        duration: 2 + Math.random() * 2,
      });
    }
    setConfetti(pieces);
  }, []);

  const imposters = gameState.players.filter(p => p.isImposter);

  const handlePlayAgain = () => {
    // Get random word or athlete
    let word: string;
    let hint: string;
    let category: string;
    
    if (gameState.mode === 'classic') {
      const entry = getRandomWord(gameState.category);
      word = entry.word;
      hint = entry.hint;
      category = entry.category;
    } else {
      const entry = getRandomAthlete(gameState.selectedSports);
      word = entry.name;
      hint = entry.hint;
      category = 'Professional Athlete';
    }
    
    // Reset players
    const players = gameState.players.map(p => ({
      ...p,
      isImposter: false,
      hasChecked: false,
    }));
    
    // Randomly select imposters
    const imposterIndices = new Set<number>();
    while (imposterIndices.size < gameState.imposterCount) {
      const index = Math.floor(Math.random() * gameState.playerCount);
      imposterIndices.add(index);
    }
    
    imposterIndices.forEach(index => {
      players[index].isImposter = true;
    });
    
    // Determine first speaker
    const firstSpeaker = gameState.settings.randomFirstSpeaker
      ? Math.floor(Math.random() * gameState.playerCount)
      : 0;
    
    onPlayAgain({
      ...gameState,
      players,
      currentWord: word,
      currentHint: hint,
      category: gameState.mode === 'classic' ? category : 'Professional Athlete',
      currentSpeaker: firstSpeaker,
    });
  };

  return (
    <div className="size-full overflow-y-auto p-4 sm:p-6 animated-bg relative">
      {/* Confetti */}
      {confetti.map(piece => (
        <div
          key={piece.id}
          className="confetti-piece"
          style={{
            left: `${piece.left}%`,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
          }}
        />
      ))}

      <div className="max-w-2xl mx-auto space-y-6 pb-6 relative z-10">
        {/* Title */}
        <div className="text-center space-y-4 animate-float">
          <Trophy className="w-20 h-20 text-yellow-400 mx-auto drop-shadow-2xl" strokeWidth={2.5} />
          <h1 className="font-display text-5xl sm:text-6xl font-bold text-white tracking-wider drop-shadow-2xl">
            ROUND OVER
          </h1>
        </div>

        {/* Answer */}
        <div className="glass-card p-8 sm:p-10 rounded-3xl border-4 border-white/30 text-center">
          <div className="text-white/60 text-sm font-black tracking-widest mb-3">
            THE {gameState.mode === 'classic' ? 'WORD' : 'PLAYER'} WAS
          </div>
          <div className="text-4xl sm:text-5xl font-black text-white mb-6 tracking-wide break-words leading-tight">
            {gameState.currentWord}
          </div>
          
          {gameState.currentHint && (
            <div className="glass-card inline-block px-6 py-3 rounded-2xl border-2 border-white/20 bg-white/5">
              <span className="text-white/60 font-bold">Hint: </span>
              <span className="text-white font-black">{gameState.currentHint}</span>
            </div>
          )}
        </div>

        {/* Imposters */}
        <div className="glass-card p-8 sm:p-10 rounded-3xl border-4 border-red-500/50 bg-red-500/10">
          <div className="text-red-400 text-sm font-black tracking-widest mb-4 text-center">
            IMPOSTER{imposters.length > 1 ? 'S' : ''}
          </div>
          <div className="space-y-3">
            {imposters.map((imposter, i) => (
              <div key={i} className="text-3xl sm:text-4xl font-black text-red-400 text-center tracking-wide">
                {imposter.name}
              </div>
            ))}
          </div>
        </div>

        {/* Round Summary */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border-4 border-white/30">
          <div className="text-white font-black text-lg tracking-wide mb-4">ROUND SUMMARY</div>
          <div className="space-y-3 font-bold">
            <div className="flex justify-between p-3 bg-white/5 rounded-xl">
              <span className="text-white/70">Category:</span>
              <span className="text-white">{gameState.mode === 'classic' ? gameState.category : 'Professional Athletes'}</span>
            </div>
            <div className="flex justify-between p-3 bg-white/5 rounded-xl">
              <span className="text-white/70">Players:</span>
              <span className="text-white">{gameState.playerCount}</span>
            </div>
            <div className="flex justify-between p-3 bg-white/5 rounded-xl">
              <span className="text-white/70">Imposters:</span>
              <span className="text-red-400">{gameState.imposterCount}</span>
            </div>
            {gameState.settings.hardMode && (
              <div className="p-3 bg-red-500/10 rounded-xl border-2 border-red-500/30 text-red-400 text-center">
                HARD MODE WAS ACTIVE
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={handlePlayAgain}
            className="btn-primary w-full glass-card p-8 rounded-3xl border-4 border-white/50 hover:border-white/70 transition-all text-white text-2xl font-black tracking-wider active:scale-95 flex items-center justify-center gap-3"
          >
            <RotateCcw size={28} strokeWidth={3} />
            PLAY AGAIN
          </button>
          
          <button
            onClick={onReturnToMenu}
            className="btn-primary w-full glass-card p-6 rounded-3xl border-4 border-white/30 hover:border-white/50 transition-all text-white/80 hover:text-white font-black text-lg tracking-wider active:scale-95 flex items-center justify-center gap-3"
          >
            <Home size={24} strokeWidth={3} />
            MAIN MENU
          </button>
        </div>
      </div>
    </div>
  );
}
