import { Player, GameState } from '../App';

interface RoleOverlayProps {
  player: Player;
  gameState: GameState;
  onClose: () => void;
}

export default function RoleOverlay({ player, gameState, onClose }: RoleOverlayProps) {
  const { settings, mode } = gameState;
  const isImposter = player.isImposter;

  const getOtherImposters = () => {
    if (!settings.impostersKnowEachOther || gameState.imposterCount < 2) return [];
    return gameState.players
      .filter(p => p.isImposter && p.name !== player.name)
      .map(p => p.name);
  };

  const otherImposters = isImposter ? getOtherImposters() : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
      style={{
        background: isImposter 
          ? 'linear-gradient(135deg, rgba(220, 38, 38, 0.97), rgba(153, 27, 27, 0.97))'
          : 'linear-gradient(135deg, rgba(17, 24, 39, 0.97), rgba(31, 41, 55, 0.97))'
      }}
    >
      <div className="max-w-lg w-full text-center space-y-6 sm:space-y-8" onClick={(e) => e.stopPropagation()}>
        {/* Role Title */}
        <div className="space-y-3 animate-float">
          <div className="font-display text-6xl sm:text-7xl font-bold text-white tracking-wider drop-shadow-2xl leading-tight break-words px-4">
            {isImposter ? 'IMPOSTER' : gameState.currentWord.toUpperCase()}
          </div>
          
          {!isImposter && (
            <div className="text-white/70 text-lg sm:text-xl font-black tracking-wide">
              YOU KNOW THE {mode === 'classic' ? 'WORD' : 'PLAYER'}
            </div>
          )}
          
          {isImposter && (
            <div className="text-white/70 text-lg sm:text-xl font-black tracking-wide">
              BLEND IN WITHOUT KNOWING
            </div>
          )}
        </div>

        {/* Category */}
        {((isImposter && settings.showCategoryToImposters && !settings.hardMode) || !isImposter) && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl border-4 border-white/30">
            <div className="text-white/60 text-xs font-black tracking-widest mb-2">CATEGORY</div>
            <div className="text-white text-2xl sm:text-3xl font-black tracking-wide">
              {mode === 'classic' ? gameState.category : 'Professional Athlete'}
            </div>
          </div>
        )}

        {/* Hint */}
        {((isImposter && settings.giveHintToImposters && !settings.hardMode) || !isImposter) && gameState.currentHint && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl border-4 border-white/30">
            <div className="text-white/60 text-xs font-black tracking-widest mb-2">HINT</div>
            <div className="text-white text-2xl sm:text-3xl font-black tracking-wide">{gameState.currentHint}</div>
          </div>
        )}

        {/* Word Length */}
        {isImposter && settings.showWordLength && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl border-4 border-white/30">
            <div className="text-white/60 text-xs font-black tracking-widest mb-2">WORD LENGTH</div>
            <div className="text-white text-3xl sm:text-4xl font-black tracking-wide">{gameState.currentWord.length} LETTERS</div>
          </div>
        )}

        {/* Other Imposters */}
        {isImposter && otherImposters.length > 0 && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl border-4 border-red-400/50 bg-red-500/20">
            <div className="text-red-300 text-xs font-black tracking-widest mb-3">
              OTHER IMPOSTER{otherImposters.length > 1 ? 'S' : ''}
            </div>
            <div className="text-white text-2xl font-black tracking-wide space-y-2">
              {otherImposters.map((name, i) => (
                <div key={i}>{name}</div>
              ))}
            </div>
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="btn-primary w-full glass-card p-6 sm:p-8 rounded-3xl border-4 border-white/50 hover:border-white/70 transition-all text-white font-black text-2xl tracking-wider active:scale-95"
        >
          GOT IT!
        </button>
      </div>
    </div>
  );
}
