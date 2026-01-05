
export type BattleEvent =
    | { type: 'start'; players: [string, string] }
    | { type: 'move'; player: string; pokemon: string; move: string }
    | { type: 'damage'; player: string; pokemon: string; amount: number; pct: number }
    | { type: 'heal'; player: string; pokemon: string; amount: number; pct: number }
    | { type: 'faint'; player: string; pokemon: string }
    | { type: 'switch'; player: string; pokemon: string; species: string; level: number; hp: number; maxhp: number }
    | { type: 'text'; message: string }
    | { type: 'win'; player: string }
    | { type: 'turn'; number: number };

export class BattleEventQueue {
    private queue: BattleEvent[] = [];

    add(event: BattleEvent) {
        this.queue.push(event);
    }

    // FIFO: Get the next event to process
    next(): BattleEvent | undefined {
        return this.queue.shift();
    }

    // Peek without removing (good for checking if animation should start)
    peek(): BattleEvent | undefined {
        return this.queue[0];
    }

    get length() {
        return this.queue.length;
    }

    clear() {
        this.queue = [];
    }
}
