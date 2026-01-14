import { useState } from 'react';
import { GameState, Player } from '../App';
import { ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import { getRandomWord } from '../data/classicWords';
import { getRandomAthlete } from '../data/sportsAthletes';

interface SetupScreenProps {
  gameState: GameState;
  onStartGame: (state: GameState) => void;
  onBack: () => void;
}

const CLASSIC_CATEGORIES = [
  'All Categories',
  'Sports',
  'Animals',
  'Food & Drink',
  'Locations',
  'Objects',
  'Entertainment',
  'Professions',
];

const SPORTS = ['NFL', 'NBA', 'MLB'];

export default function SetupScreen({ gameState, onStartGame, onBack }: SetupScreenProps) {
  const [state, setState] = useState(gameState);
  const [playerNames, setPlayerNames] = useState<string[]>(
    Array(gameState.playerCount).fill('').map((_, i) => `Player ${i + 1}`)
  );
  const [settingsOpen, setSettingsOpen] = useState(false);

  const updatePlayerCount = (count: number) => {
    const newCount = Math.max(3, Math.min(20, count));
    setState({ ...state, playerCount: newCount, imposterCount: Math.min(state.imposterCount, newCount - 1) });
    setPlayerNames(prev => {
      const newNames = [...prev];
      if (newCount > prev.length) {
        for (let i = prev.length; i < newCount; i++) {
          newNames.push(`Player ${i + 1}`);
        }
      }
      return newNames.slice(0, newCount);
    });
  };

  const updateImposterCount = (count: number) => {
    const maxImposters = state.playerCount - 1;
    const newCount = Math.max(1, Math.min(maxImposters, count));
    setState({ ...state, imposterCount: newCount });
  };

  const toggleSport = (sport: string) => {
    const newSports = state.selectedSports.includes(sport)
      ? state.selectedSports.filter(s => s !== sport)
      : [...state.selectedSports, sport];
    setState({ ...state, selectedSports: newSports });
  };

  const handleStartGame = () => {
    if (state.mode === 'sports' && state.selectedSports.length === 0) {
      alert('Please select at least one sport');
      return;
    }
    
    // Get random word or athlete
    let word: string;
    let hint: string;
    let category: string;
    
    if (state.mode === 'classic') {
      const entry = getRandomWord(state.category);
      word = entry.word;
      hint = entry.hint;
      category = entry.category;
    } else {
      const entry = getRandomAthlete(state.selectedSports);
      word = entry.name;
      hint = entry.hint;
      category = 'Professional Athlete';
    }
    
    // Assign imposters
    const players: Player[] = playerNames.map(name => ({
      name,
      isImposter: false,
      hasChecked: false,
    }));
    
    // Randomly select imposters
    const imposterIndices = new Set<number>();
    while (imposterIndices.size < state.imposterCount) {
      const index = Math.floor(Math.random() * state.playerCount);
      imposterIndices.add(index);
    }
    
    imposterIndices.forEach(index => {
      players[index].isImposter = true;
    });
    
    // Determine first speaker
    const firstSpeaker = state.settings.randomFirstSpeaker
      ? Math.floor(Math.random() * state.playerCount)
      : 0;
    
    onStartGame({
      ...state,
      players,
      currentWord: word,
      currentHint: hint,
      category: state.mode === 'classic' ? category : 'Professional Athlete',
      currentSpeaker: firstSpeaker,
    });
  };

  return (
    <div className="size-full overflow-y-auto p-4 sm:p-6 animated-bg">
      <div className="max-w-2xl mx-auto space-y-5 pb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <button 
            onClick={onBack} 
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors font-bold active:scale-95"
          >
            <ArrowLeft size={24} />
            <span className="hidden sm:inline">Back</span>
          </button>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-wide">
            {state.mode === 'classic' ? 'CLASSIC' : 'SPORTS'}
          </h1>
          <div className="w-16"></div>
        </div>

        {/* Player Count */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border-4 border-white/30">
          <label className="text-white font-black text-lg mb-4 block tracking-wide">PLAYERS</label>
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={() => updatePlayerCount(state.playerCount - 1)}
              className="w-16 h-16 rounded-2xl bg-white/20 hover:bg-white/30 active:bg-white/40 text-white text-3xl font-black transition-all active:scale-95"
            >
              −
            </button>
            <div className="text-6xl font-black text-white w-24 text-center">{state.playerCount}</div>
            <button
              onClick={() => updatePlayerCount(state.playerCount + 1)}
              className="w-16 h-16 rounded-2xl bg-white/20 hover:bg-white/30 active:bg-white/40 text-white text-3xl font-black transition-all active:scale-95"
            >
              +
            </button>
          </div>
        </div>

        {/* Imposter Count */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border-4 border-red-500/40 bg-red-500/5">
          <label className="text-red-400 font-black text-lg mb-4 block tracking-wide">IMPOSTERS</label>
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={() => updateImposterCount(state.imposterCount - 1)}
              className="w-16 h-16 rounded-2xl bg-red-500/20 hover:bg-red-500/30 active:bg-red-500/40 text-white text-3xl font-black transition-all active:scale-95"
            >
              −
            </button>
            <div className="text-6xl font-black text-red-400 w-24 text-center">{state.imposterCount}</div>
            <button
              onClick={() => updateImposterCount(state.imposterCount + 1)}
              className="w-16 h-16 rounded-2xl bg-red-500/20 hover:bg-red-500/30 active:bg-red-500/40 text-white text-3xl font-black transition-all active:scale-95"
            >
              +
            </button>
          </div>
        </div>

        {/* Category/Sport Selection */}
        {state.mode === 'classic' ? (
          <div className="glass-card p-6 sm:p-8 rounded-3xl border-4 border-white/30">
            <label className="text-white font-black text-lg mb-4 block tracking-wide">CATEGORY</label>
            <select
              value={state.category}
              onChange={(e) => setState({ ...state, category: e.target.value })}
              className="w-full bg-white/10 border-2 border-white/30 rounded-2xl px-6 py-4 text-white font-bold text-lg focus:outline-none focus:border-white/50 focus:bg-white/15"
            >
              {CLASSIC_CATEGORIES.map(cat => (
                <option key={cat} value={cat} className="bg-gray-900 font-bold">{cat}</option>
              ))}
            </select>
          </div>
        ) : (
          <div className="glass-card p-6 sm:p-8 rounded-3xl border-4 border-orange-500/40 bg-orange-500/5">
            <label className="text-orange-400 font-black text-lg mb-4 block tracking-wide">SELECT SPORTS</label>
            <div className="flex gap-3">
              {SPORTS.map(sport => (
                <button
                  key={sport}
                  onClick={() => toggleSport(sport)}
                  className={`flex-1 px-6 py-5 rounded-2xl font-black text-lg tracking-wide transition-all active:scale-95 ${
                    state.selectedSports.includes(sport)
                      ? 'bg-orange-500 text-white border-2 border-orange-400'
                      : 'bg-white/10 text-white/60 border-2 border-white/20 hover:bg-white/20'
                  }`}
                >
                  {sport}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Player Names */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border-4 border-white/30">
          <label className="text-white font-black text-lg mb-4 block tracking-wide">PLAYER NAMES</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {playerNames.map((name, i) => (
              <input
                key={i}
                value={name}
                onChange={(e) => {
                  const newNames = [...playerNames];
                  newNames[i] = e.target.value;
                  setPlayerNames(newNames);
                }}
                className="bg-white/10 border-2 border-white/30 rounded-2xl px-5 py-4 text-white font-bold placeholder-white/40 focus:outline-none focus:border-white/50 focus:bg-white/15"
                placeholder={`Player ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="glass-card rounded-3xl border-4 border-white/30 overflow-hidden">
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="w-full p-6 sm:p-8 flex items-center justify-between text-white hover:bg-white/10 active:bg-white/15 transition-all"
          >
            <span className="font-black text-lg tracking-wide">SETTINGS</span>
            {settingsOpen ? <ChevronUp size={28} strokeWidth={3} /> : <ChevronDown size={28} strokeWidth={3} />}
          </button>
          
          {settingsOpen && (
            <div className="p-6 sm:p-8 pt-0 space-y-5 border-t-4 border-white/20">
              <label className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                <span className="text-white/90 font-bold text-base">Show category to imposters</span>
                <input
                  type="checkbox"
                  checked={state.settings.showCategoryToImposters}
                  onChange={(e) => setState({
                    ...state,
                    settings: { ...state.settings, showCategoryToImposters: e.target.checked }
                  })}
                  className="w-7 h-7 rounded accent-white"
                />
              </label>
              
              <label className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                <span className="text-white/90 font-bold text-base">Give hint to imposters</span>
                <input
                  type="checkbox"
                  checked={state.settings.giveHintToImposters}
                  onChange={(e) => setState({
                    ...state,
                    settings: { ...state.settings, giveHintToImposters: e.target.checked }
                  })}
                  className="w-7 h-7 rounded accent-white"
                />
              </label>
              
              <label className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                <span className="text-white/90 font-bold text-base">Imposters know each other</span>
                <input
                  type="checkbox"
                  checked={state.settings.impostersKnowEachOther}
                  onChange={(e) => setState({
                    ...state,
                    settings: { ...state.settings, impostersKnowEachOther: e.target.checked }
                  })}
                  className="w-7 h-7 rounded accent-white"
                />
              </label>
              
              <label className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                <span className="text-white/90 font-bold text-base">Random first speaker</span>
                <input
                  type="checkbox"
                  checked={state.settings.randomFirstSpeaker}
                  onChange={(e) => setState({
                    ...state,
                    settings: { ...state.settings, randomFirstSpeaker: e.target.checked }
                  })}
                  className="w-7 h-7 rounded accent-white"
                />
              </label>
              
              <label className="flex items-center justify-between p-4 bg-red-500/10 rounded-2xl border-2 border-red-500/30">
                <span className="text-red-300 font-bold text-base">Hard mode (no hints)</span>
                <input
                  type="checkbox"
                  checked={state.settings.hardMode}
                  onChange={(e) => setState({
                    ...state,
                    settings: { ...state.settings, hardMode: e.target.checked }
                  })}
                  className="w-7 h-7 rounded accent-red-500"
                />
              </label>
              
              <label className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                <span className="text-white/90 font-bold text-base">Show word length</span>
                <input
                  type="checkbox"
                  checked={state.settings.showWordLength}
                  onChange={(e) => setState({
                    ...state,
                    settings: { ...state.settings, showWordLength: e.target.checked }
                  })}
                  className="w-7 h-7 rounded accent-white"
                />
              </label>
              
              <label className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                <span className="text-white/90 font-bold text-base">Sound effects</span>
                <input
                  type="checkbox"
                  checked={state.settings.soundEffects}
                  onChange={(e) => setState({
                    ...state,
                    settings: { ...state.settings, soundEffects: e.target.checked }
                  })}
                  className="w-7 h-7 rounded accent-white"
                />
              </label>
            </div>
          )}
        </div>

        {/* Start Button */}
        <button
          onClick={handleStartGame}
          className="btn-primary w-full glass-card p-8 rounded-3xl border-4 border-white/50 hover:border-white/70 transition-all text-white text-2xl font-black tracking-wider active:scale-95 bg-gradient-to-r from-white/10 to-transparent"
        >
          START GAME
        </button>
      </div>
    </div>
  );
}
