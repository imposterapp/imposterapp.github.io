import { useState, useEffect } from 'react';
import { GameState, Player } from '../App';
import { Settings } from 'lucide-react';
import RoleOverlay from './RoleOverlay';

interface GameScreenProps {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  onReveal: () => void;
}

export default function GameScreen({ gameState, setGameState, onReveal }: GameScreenProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [startPulse, setStartPulse] = useState(false);

  useEffect(() => {
    // Start pulse animation after 500ms
    const timer = setTimeout(() => setStartPulse(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handlePlayerClick = (index: number) => {
    if (gameState.players[index]?.hasChecked) return;
    setSelectedPlayer(index);
  };

  const handleCloseOverlay = () => {
    if (selectedPlayer === null) return;
    
    // Play sound effect
    if (gameState.settings.soundEffects) {
      const isImposter = gameState.players[selectedPlayer].isImposter;
      playSound(isImposter ? 'imposter' : 'regular');
    }
    
    const updatedPlayers = [...gameState.players];
    updatedPlayers[selectedPlayer].hasChecked = true;
    setGameState({ ...gameState, players: updatedPlayers });
    setSelectedPlayer(null);
  };

  const playSound = (type: 'imposter' | 'regular' | 'complete') => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (type === 'imposter') {
      oscillator.type = 'sawtooth';
      oscillator.frequency.value = 200;
    } else if (type === 'regular') {
      oscillator.type = 'sine';
      oscillator.frequency.value = 400;
    } else {
      // Complete sound - two chimes
      oscillator.type = 'sine';
      oscillator.frequency.value = 600;
      setTimeout(() => {
        oscillator.frequency.value = 800;
      }, 100);
    }
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  const allPlayersChecked = gameState.players.every(p => p.hasChecked);

  useEffect(() => {
    if (allPlayersChecked && gameState.settings.soundEffects) {
      playSound('complete');
    }
  }, [allPlayersChecked]);

  return (
    <div className="size-full overflow-y-auto p-4 sm:p-6 animated-bg">
      <div className="max-w-5xl mx-auto space-y-6 pb-6">
        {/* Speaker Card */}
        <div className="speaker-card glass-card p-8 sm:p-10 rounded-3xl border-4 border-white/30 text-center">
          <div className="text-white/60 text-sm font-black tracking-wider mb-2">CURRENT SPEAKER</div>
          <div className="text-4xl sm:text-5xl font-black text-white tracking-wide">
            {gameState.players[gameState.currentSpeaker]?.name || 'Player 1'}
          </div>
        </div>

        {/* Player Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {gameState.players.map((player, index) => (
            <button
              key={index}
              onClick={() => handlePlayerClick(index)}
              className={`player-tile glass-card p-6 sm:p-8 rounded-3xl border-4 transition-all ${
                player.hasChecked
                  ? player.isImposter
                    ? 'border-red-500/50 bg-red-500/10 opacity-50'
                    : 'border-white/20 bg-black/30 opacity-50'
                  : 'border-white/40 hover:border-white/60 active:border-white/80 cursor-pointer'
              } ${startPulse && !player.hasChecked ? 'animate-pulse-tile' : ''}`}
              disabled={player.hasChecked}
            >
              <div className="text-white font-black text-lg sm:text-xl text-center break-words tracking-wide leading-tight">
                {player.name}
              </div>
            </button>
          ))}

          
        </div>

        {/* Action Buttons */}
        {allPlayersChecked && (
          <div className="flex gap-4">
            <button
              onClick={onReveal}
              className="btn-primary flex-1 glass-card p-6 rounded-3xl border-4 border-white/50 hover:border-white/70 transition-all text-white font-black text-xl tracking-wider active:scale-95"
            >
              REVEAL
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="glass-card p-6 rounded-3xl border-4 border-white/40 hover:border-white/60 transition-all active:scale-95 min-w-[72px]"
            >
              <Settings className="text-white mx-auto" size={28} strokeWidth={3} />
            </button>
          </div>
        )}

        {/* Settings Panel */}
        {showSettings && allPlayersChecked && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl border-4 border-white/30 space-y-4">
            <h3 className="text-white font-black text-xl tracking-wide mb-4">GAME INFO</h3>
            <div className="text-white/80 space-y-3 font-bold">
              <div className="flex justify-between p-3 bg-white/5 rounded-xl">
                <span>Category:</span>
                <span className="text-white">{gameState.mode === 'classic' ? gameState.category : 'Sports'}</span>
              </div>
              <div className="flex justify-between p-3 bg-white/5 rounded-xl">
                <span>Players:</span>
                <span className="text-white">{gameState.playerCount}</span>
              </div>
              <div className="flex justify-between p-3 bg-white/5 rounded-xl">
                <span>Imposters:</span>
                <span className="text-red-400">{gameState.imposterCount}</span>
              </div>
              {gameState.settings.hardMode && (
                <div className="p-3 bg-red-500/10 rounded-xl border-2 border-red-500/30 text-red-400 text-center">
                  HARD MODE ACTIVE
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Role Overlay */}
      {selectedPlayer !== null && (
        <RoleOverlay
          player={gameState.players[selectedPlayer]}
          gameState={gameState}
          onClose={handleCloseOverlay}
        />
      )}
    </div>
  );
}
