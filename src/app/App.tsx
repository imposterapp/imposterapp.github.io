import { useState } from 'react';
import MenuScreen from './components/MenuScreen';
import SetupScreen from './components/SetupScreen';
import GameScreen from './components/GameScreen';
import RevealScreen from './components/RevealScreen';

type GameMode = 'classic' | 'sports';
type Screen = 'menu' | 'setup' | 'game' | 'reveal';

export interface GameSettings {
  showCategoryToImposters: boolean;
  giveHintToImposters: boolean;
  impostersKnowEachOther: boolean;
  randomFirstSpeaker: boolean;
  hardMode: boolean;
  showWordLength: boolean;
  soundEffects: boolean;
}

export interface Player {
  name: string;
  isImposter: boolean;
  hasChecked: boolean;
}

export interface GameState {
  mode: GameMode;
  playerCount: number;
  imposterCount: number;
  category: string;
  selectedSports: string[];
  settings: GameSettings;
  players: Player[];
  currentWord: string;
  currentHint: string;
  currentSpeaker: number;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('menu');
  const [gameState, setGameState] = useState<GameState | null>(null);

  const handleModeSelect = (mode: GameMode) => {
    setGameState({
      mode,
      playerCount: 6,
      imposterCount: 1,
      category: mode === 'classic' ? 'All Categories' : '',
      selectedSports: mode === 'sports' ? ['NFL', 'NBA', 'MLB'] : [],
      settings: {
        showCategoryToImposters: true,
        giveHintToImposters: true,
        impostersKnowEachOther: false,
        randomFirstSpeaker: true,
        hardMode: false,
        showWordLength: false,
        soundEffects: false,
      },
      players: [],
      currentWord: '',
      currentHint: '',
      currentSpeaker: 0,
    });
    setScreen('setup');
  };

  const handleStartGame = (updatedState: GameState) => {
    setGameState(updatedState);
    setScreen('game');
  };

  const handleReveal = () => {
    setScreen('reveal');
  };

  const handleReturnToMenu = () => {
    setScreen('menu');
    setGameState(null);
  };

  const handlePlayAgain = (updatedState: GameState) => {
    setGameState(updatedState);
    setScreen('game');
  };

  return (
    <div className="size-full overflow-hidden">
      {screen === 'menu' && <MenuScreen onModeSelect={handleModeSelect} />}
      {screen === 'setup' && gameState && (
        <SetupScreen gameState={gameState} onStartGame={handleStartGame} onBack={handleReturnToMenu} />
      )}
      {screen === 'game' && gameState && (
        <GameScreen gameState={gameState} setGameState={setGameState} onReveal={handleReveal} />
      )}
      {screen === 'reveal' && gameState && (
        <RevealScreen gameState={gameState} onPlayAgain={handlePlayAgain} onReturnToMenu={handleReturnToMenu} />
      )}
    </div>
  );
}