
import { BattleSystem, StandardMon } from '../src/lib/battle/engine';

// Mock Data representing Standard Sets
const CHARIZARD_SET: StandardMon = {
    name: 'Sparky',
    species: 'charmander', // Using base species for simple test or 'charizard'
    moves: ['ember', 'scratch'],
    ability: 'blaze',
    item: '',
    gender: 'M',
    evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
    ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
    level: 50,
    nature: 'Serious',
};

const SQUIRTLE_SET: StandardMon = {
    name: 'Splashy',
    species: 'squirtle',
    moves: ['watergun', 'tackle'],
    ability: 'torrent',
    item: '',
    gender: 'M',
    evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
    ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
    level: 50,
    nature: 'Serious',
};

// Simple Test Runner
function runTest() {
    console.log('--- STARTING ENGINE TEST ---');

    // 1. Initialize Battle System
    const system = new BattleSystem();

    // 2. Start Battle
    system.startBattle([CHARIZARD_SET], [SQUIRTLE_SET]);
    console.log('Battle Started.');

    // 3. Simulate Team Preview (Turn 0)
    console.log('\n--- TEAM PREVIEW ---');
    // We send 'team 1' to keep default order (Lead is slot 1)
    system.choose('p1', 'team 1');
    system.choose('p2', 'team 1');
    console.log('Players selected leads.');

    // 4. Simulate Turn 1
    console.log('\n--- TURN 1 ---');
    console.log('P1 (Sparky) uses Ember.');
    console.log('P2 (Splashy) uses Water Gun.');

    // Note: Engine inputs usually are "move <index>" or "move <name>"
    // BattleSystem.choose expects player id and string.

    system.choose('p1', 'move ember');
    system.choose('p2', 'move watergun');

    // 4. Verify Logs / Queue
    // We check the queue instead of raw logs now
    const queue = system.queue;

    let sparkyDmg = false;
    let notVeryEffective = false;
    let superEffective = false;

    // Drain queue
    while (queue.length > 0) {
        const event = queue.next();
        if (!event) break;

        console.log('EVENT:', event);

        // Check for effectiveness messages (captured in text or damage?)
        // Our simple parser currently captures: move, damage, faint, turn, win.
        // We might need to check raw logs for "effective" messages if we want to be strict.
    }

    // Check RAW LOGS for effectiveness (as queue parser is minimal)
    const log = system.log;
    console.log("DEBUG RAW LOGS:", log);

    log.forEach(line => {
        if (line.includes('|-resisted|p2a: Splashy')) {
            console.log('✅ Fire -> Water Resisted verified.');
            notVeryEffective = true;
        }
        if (line.includes('|-supereffective|p1a: Sparky')) {
            console.log('✅ Water -> Fire Super Effective verified.');
            superEffective = true;
        }
    });

    if (notVeryEffective && superEffective) {
        console.log('\n✅ ENGINE VERIFICATION PASSED');
    } else {
        console.log('\n❌ ENGINE VERIFICATION FAILED');
        process.exit(1);
    }
}

runTest();
