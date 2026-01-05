
import { Battle, Side, StatsTable } from '@pkmn/sim';
import { BattleEventQueue } from './queue';

// Standard Pokémon Set Interface (replacing CustomPokemonRow for now)
export interface StandardMon {
    name: string;
    species: string;
    moves: string[];
    ability: string;
    item: string;
    gender: string; // Required by PokemonSet
    evs: StatsTable; // Required
    ivs: StatsTable; // Required
    level: number; // Required
    shiny?: boolean;
    nature: string;
}

export class BattleSystem {
    private battle: Battle;
    public queue: BattleEventQueue;
    private logIndex = 0;

    constructor(seed?: number[]) {
        this.queue = new BattleEventQueue();
        this.battle = new Battle({
            formatid: 'gen9customgame' as any,
            seed: (seed && seed.length === 4) ? (seed.join(',') as any) : undefined
        });
    }

    // Safe accessors for UI
    public get p1(): Side { return this.battle.sides[0]; }
    public get p2(): Side { return this.battle.sides[1]; }

    startBattle(p1Team: StandardMon[], p2Team: StandardMon[]) {
        // Create valid Team specs for @pkmn/sim
        const p1Spec = {
            name: 'Player 1',
            team: p1Team
        };
        const p2Spec = {
            name: 'Player 2',
            team: p2Team
        };

        this.battle.setPlayer('p1', p1Spec);
        this.battle.setPlayer('p2', p2Spec);

        this.queue.add({ type: 'start', players: ['Player 1', 'Player 2'] });
        this.updateQueue();
    }

    choose(player: 'p1' | 'p2', input: string) {
        this.battle.choose(player, input);
        this.updateQueue();
    }

    private updateQueue() {
        // Process new logs into events
        const newLogs = this.battle.log.slice(this.logIndex);
        this.logIndex = this.battle.log.length;

        for (const line of newLogs) {
            const parts = line.split('|');
            if (parts.length < 2) continue;

            const type = parts[1];

            // |move|p1a: Name|MoveName|target
            if (type === 'move') {
                const player = parts[2].startsWith('p1') ? 'p1' : 'p2';
                const pokemon = parts[2].split(':')[1].trim();
                const move = parts[3];
                this.queue.add({ type: 'move', player, pokemon, move });
            }
            // |-damage|p1a: Name|hp/maxhp
            else if (type === '-damage') {
                const player = parts[2].startsWith('p1') ? 'p1' : 'p2';
                const pokemon = parts[2].split(':')[1].trim();
                const hpStr = parts[3];

                if (hpStr.includes('fnt')) {
                    // Handled by faint
                } else {
                    const [current, max] = hpStr.split('/').map(Number);
                    // Avoid NaN if max is 0 (shouldn't happen)
                    const pct = max ? Math.floor((current / max) * 100) : 0;
                    this.queue.add({ type: 'damage', player, pokemon, amount: 0, pct });
                }
            }
            // |-heal|p1a: Name|hp/maxhp
            else if (type === '-heal') {
                const player = parts[2].startsWith('p1') ? 'p1' : 'p2';
                const pokemon = parts[2].split(':')[1].trim();
                const hpStr = parts[3];
                const [current, max] = hpStr.split('/').map(Number);
                const pct = max ? Math.floor((current / max) * 100) : 0;
                this.queue.add({ type: 'heal', player, pokemon, amount: 0, pct });
            }
            // |faint|p1a: Name
            else if (type === 'faint') {
                const player = parts[2].startsWith('p1') ? 'p1' : 'p2';
                const pokemon = parts[2].split(':')[1].trim();
                this.queue.add({ type: 'faint', player, pokemon });
            }
            // |turn|N
            else if (type === 'turn') {
                this.queue.add({ type: 'turn', number: parseInt(parts[2]) });
            }
            // |win|PlayerName
            else if (type === 'win') {
                this.queue.add({ type: 'win', player: parts[2] });
            }
        }
    }

    public generateHash(): string {
        // Simple hash: Turn + Log Length + Last Log Line
        // In production, use a proper hash of the entire log.
        const lastLine = this.battle.log.length > 0 ? this.battle.log[this.battle.log.length - 1] : '';
        return `${this.battle.turn}:${this.battle.log.length}:${lastLine}`;
    }

    get turn() {
        return this.battle.turn;
    }

    get log() {
        return this.battle.log;
    }
}
