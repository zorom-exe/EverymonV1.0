
import { StandardMon } from '@/lib/battle/engine';

export const P1_TEAM_FULL: StandardMon[] = [
    {
        name: 'Charizard',
        species: 'charizard',
        moves: ['flamethrower', 'airslash', 'dragonpulse', 'roost'],
        ability: 'blaze',
        item: 'lifeorb',
        gender: 'M',
        evs: { hp: 0, atk: 0, def: 0, spa: 252, spd: 4, spe: 252 },
        ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
        level: 50,
        nature: 'Timids'
    },
    {
        name: 'Gengar',
        species: 'gengar',
        moves: ['shadowball', 'sludgebomb', 'thunderbolt', 'destinybond'],
        ability: 'cursedbody',
        item: 'focussash',
        gender: 'M',
        evs: { hp: 4, atk: 0, def: 0, spa: 252, spd: 0, spe: 252 },
        ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
        level: 50,
        nature: 'Timids'
    },
    {
        name: 'Dragonite',
        species: 'dragonite',
        moves: ['dragonclaw', 'extremespeed', 'firepunch', 'roost'],
        ability: 'multiscale',
        item: 'leftovers',
        gender: 'F',
        evs: { hp: 252, atk: 252, def: 4, spa: 0, spd: 0, spe: 0 },
        ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
        level: 50,
        nature: 'Adamant'
    },
    {
        name: 'Scizor',
        species: 'scizor',
        moves: ['bulletpunch', 'uturn', 'roost', 'swordsdance'],
        ability: 'technician',
        item: 'lifeorb',
        gender: 'M',
        evs: { hp: 252, atk: 252, def: 4, spa: 0, spd: 0, spe: 0 },
        ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
        level: 50,
        nature: 'Adamant'
    },
    {
        name: 'Rotom-Wash',
        species: 'rotomwash',
        moves: ['hydropump', 'voltswitch', 'willowisp', 'protect'],
        ability: 'levitate',
        item: 'sitrusberry',
        gender: 'N',
        evs: { hp: 252, atk: 0, def: 252, spa: 4, spd: 0, spe: 0 },
        ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
        level: 50,
        nature: 'Bold'
    },
    {
        name: 'Tyranitar',
        species: 'tyranitar',
        moves: ['stoneedge', 'crunch', 'earthquake', 'stealthrock'],
        ability: 'sandstream',
        item: 'chopleberry',
        gender: 'M',
        evs: { hp: 252, atk: 252, def: 4, spa: 0, spd: 0, spe: 0 },
        ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
        level: 50,
        nature: 'Adamant'
    }
];

export const P2_TEAM_FULL: StandardMon[] = [
    {
        name: 'Blastoise',
        species: 'blastoise',
        moves: ['surf', 'icebeam', 'rapidspin', 'protect'],
        ability: 'torrent',
        item: 'leftovers',
        gender: 'M',
        evs: { hp: 252, atk: 0, def: 252, spa: 4, spd: 0, spe: 0 },
        ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
        level: 50,
        nature: 'Bold'
    },
    {
        name: 'Gyarados',
        species: 'gyarados',
        moves: ['waterfall', 'bounce', 'dragondance', 'taunt'],
        ability: 'intimidate',
        item: 'leftovers',
        gender: 'M',
        evs: { hp: 0, atk: 252, def: 4, spa: 0, spd: 0, spe: 252 },
        ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
        level: 50,
        nature: 'Jolly'
    },
    {
        name: 'Arcanine',
        species: 'arcanine',
        moves: ['flareblitz', 'extremespeed', 'wildcharge', 'morningsun'],
        ability: 'intimidate',
        item: 'rockyhelmet',
        gender: 'M',
        evs: { hp: 252, atk: 4, def: 252, spa: 0, spd: 0, spe: 0 },
        ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
        level: 50,
        nature: 'Impish'
    },
    {
        name: 'Alakazam',
        species: 'alakazam',
        moves: ['psychic', 'shadowball', 'focusblast', 'nastyplot'],
        ability: 'magicguard',
        item: 'lifeorb',
        gender: 'M',
        evs: { hp: 4, atk: 0, def: 0, spa: 252, spd: 0, spe: 252 },
        ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
        level: 50,
        nature: 'Timids'
    },
    {
        name: 'Venusaur',
        species: 'venusaur',
        moves: ['gigadrain', 'sludgebomb', 'sleeppowder', 'leechseed'],
        ability: 'overgrow',
        item: 'blacksludge',
        gender: 'M',
        evs: { hp: 252, atk: 0, def: 252, spa: 4, spd: 0, spe: 0 },
        ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
        level: 50,
        nature: 'Bold'
    },
    {
        name: 'Snorlax',
        species: 'snorlax',
        moves: ['bodyslam', 'earthquake', 'crunch', 'rest'],
        ability: 'thickfat',
        item: 'leftovers',
        gender: 'M',
        evs: { hp: 252, atk: 4, def: 252, spa: 0, spd: 0, spe: 0 },
        ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
        level: 50,
        nature: 'Careful'
    }
];
