import { useState } from 'react';
import { Swords, ChevronRight } from 'lucide-react';
import { useGame } from '@/game/useGame';
import { PassDeviceScreen } from '@/components/PassDeviceScreen';
import { GameBoard } from '@/components/GameBoard';
import { GameOverScreen } from '@/components/GameOverScreen';

type FlowPhase = 'menu' | 'pass' | 'play';

function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen bg-ink-900 flex flex-col items-center justify-center px-6">
      <div className="animate-pulse-glow w-20 h-20 rounded-2xl border-2 border-gold-500/40 flex items-center justify-center mb-6">
        <Swords size={36} className="text-gold-400" />
      </div>
      <h1 className="font-display text-3xl font-black text-gold-300 mb-2 text-center">Bestias de Guerra</h1>
      <p className="text-sm text-ink-300 text-center mb-1">Juego de cartas con baraja española</p>
      <p className="text-xs text-ink-400 text-center mb-8 max-w-xs">
        2 jugadores · 48 cartas cada uno · 100 PV · 6 espacios
      </p>
      <button
        onClick={onStart}
        className="px-8 py-3 rounded-xl bg-gold-400 text-ink-900 font-display font-bold hover:bg-gold-300 shadow-glow active:scale-95 transition-all duration-200 flex items-center gap-2"
      >
        Empezar partida
        <ChevronRight size={18} />
      </button>
    </div>
  );
}

function App() {
  const { state, dispatch } = useGame();
  const [flow, setFlow] = useState<FlowPhase>('menu');

  if (state.phase === 'game-over') {
    const winner = state.winner!;
    return (
      <GameOverScreen
        winnerName={state.players[winner].name}
        loserName={state.players[winner === 0 ? 1 : 0].name}
        onRestart={() => {
          dispatch({ type: 'RESTART' });
          setFlow('menu');
        }}
      />
    );
  }

  if (flow === 'menu') {
    return (
      <StartScreen
        onStart={() => {
          dispatch({ type: 'START_GAME' });
          setFlow('pass');
        }}
      />
    );
  }

  if (flow === 'pass' || state.phase === 'pass') {
    const targetName = state.players[state.passTarget].name;
    return (
      <PassDeviceScreen
        playerName={targetName}
        message={`Pasa el dispositivo a ${targetName}. Es su turno.`}
        onConfirm={() => {
          dispatch({ type: 'CONFIRM_PASS' });
          setFlow('play');
        }}
      />
    );
  }

  if (flow === 'play' && (state.phase === 'playing' || state.phase === 'trap-response' || state.phase === 'dice-roll')) {
    return <GameBoard state={state} dispatch={dispatch} />;
  }

  return (
    <StartScreen
      onStart={() => {
        dispatch({ type: 'START_GAME' });
        setFlow('pass');
      }}
    />
  );
}

export default App;
