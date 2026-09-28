import type { Action, Difficulty, GameState } from './types';

export function buildCpuTurn(state: GameState): Action[] {
  const cpu = state.players[1];
  const actions: Action[] = [];
  const monster = cpu.hand.find((card) => card.type === 'monster');

  if (monster && cpu.field.some((slot) => slot === null)) {
    actions.push({ type: 'SUMMON_MONSTER', card: monster, position: state.difficulty === 'easy' ? 'attack' : 'defense' });
  }

  const attacker = cpu.field.find((slot) => slot && slot.position === 'attack' && !slot.hasAttacked);
  const target = state.players[0].field.find(Boolean);
  if (attacker && target && state.difficulty !== 'easy') {
    actions.push({ type: 'START_ATTACK', attackerUid: attacker.uid });
    actions.push({ type: 'DECLARE_ATTACK', attackerUid: attacker.uid, defenderUid: target.uid });
  }

  actions.push({ type: 'END_TURN' });
  return actions;
}

export function cpuDelay(difficulty: Difficulty): number {
  return difficulty === 'easy' ? 450 : difficulty === 'hard' ? 850 : 650;
}
