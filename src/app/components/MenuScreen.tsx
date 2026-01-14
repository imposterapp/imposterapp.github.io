interface MenuScreenProps {
  onModeSelect: (mode: 'classic' | 'sports') => void;
}

export default function MenuScreen({ onModeSelect }: MenuScreenProps) {
  return (
    <div className="size-full flex items-center justify-center p-4 animated-bg">
      <div className="max-w-lg w-full space-y-10 animate-float">
        <div className="text-center">
          <h1 className="font-display text-7xl sm:text-8xl font-bold text-white tracking-wider drop-shadow-2xl">
            IMPOSTER
          </h1>
          <p className="text-white/70 text-xl font-bold tracking-wide">
            Who doesn't know the word?
          </p>
        </div>
        
        <div className="space-y-5">
          <button
            onClick={() => onModeSelect('classic')}
            className="btn-primary w-full glass-card p-10 rounded-3xl border-4 border-white/30 hover:border-white/50 transition-all active:scale-95 group"
          >
            <div className="text-3xl font-black text-white mb-3 tracking-wide">CLASSIC MODE</div>
            <div className="text-white/70 font-bold text-lg">850+ words · 7 categories</div>
          </button>
          
          <button
            onClick={() => onModeSelect('sports')}
            className="btn-primary w-full glass-card p-10 rounded-3xl border-4 border-white-500/50 hover:border-white-500/70 transition-all active:scale-95 group bg-gradient-to-br from-orange-500/10 to-transparent"
          >
            <div className="text-3xl font-black text-white mb-3 tracking-wide">SPORTS MODE</div>
            <div className="text-white/70 font-bold text-lg">200+ pro athletes</div>
          </button>
        </div>
        
        <div className="text-center">
          <p className="text-white/40 text-sm font-medium">
            Tap a mode to begin
          </p>
        </div>
      </div>
    </div>
  );
}
