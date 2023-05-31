import { GameObject } from '../../engine/elements/gameobject';
import { Random } from '../../engine/utils/random';
import { Exit, Space, Wall } from '../entites/env';
import { Hero } from '../entites/hero';
import { Heal, Loot, Weapon } from '../entites/items';
import { LootPlace } from '../entites/items/amunition';
import { FireBallLoot } from '../entites/items/fbloot';
import { HealSize } from '../entites/items/heal';
import { LootCharacteristics } from '../entites/items/loot';
import { Bat } from '../entites/mobs';
import { Urglorg } from '../entites/mobs/urglorg';

type WeaponDescriber = [LootPlace, string, Partial<LootCharacteristics>];
const weapons: WeaponDescriber[] = [
    ['rightHand', 'Sword', { damage: 3 }],
    ['rightHand', 'Dagger', { damage: 1 }],
    ['leftHand', 'Shield', { armor: 5 }],
    ['leftHand', 'Left Hand Dagger', { damage: 1 }],
    ['rightHand', 'Book', { damage: 0 }],
    ['leftHand', 'Magic Book', { damage: 2, armor: 5 }],

    ['head', 'Simple Helmet', { armor: 3 }],
    ['head', 'German Helmet', { armor: 3, damage: 1 }],
    ['head', 'Headband', { armor: 1 }],

    ['body', 'T-Shirt', { armor: 1 }],
    ['body', 'Chain Mail', { armor: 10 }],
    ['body', 'Blade Mail', { armor: 10, damage: 1 }]
];

function randomWeaponLoot(point: [number, number]): Loot {
    const idx = Math.floor(Math.random() * weapons.length);
    const record = weapons[idx];
    return new Weapon(point, ...record);
}

const healDist: [HealSize, number][] = [
    ['Small', 7],
    ['Medium', 2],
    ['Big', 1]
];

function randomPotionLoot(point: [number, number]): Loot {
    const size = Random.pickWithWeight(healDist);
    return new Heal(point, size);
}

function randomFireBallLoot(point: [number, number]): Loot {
    const count = Math.ceil(Math.random() * 10);
    return new FireBallLoot(point, count);
}

const lootDist: [(point: [number, number]) => Loot, number][] = [
    [randomWeaponLoot, 3],
    [randomPotionLoot, 5],
    [randomFireBallLoot, 5]
];

function randomLoot(point: [number, number]): Loot {
    const func = Random.pickWithWeight(lootDist);
    return func(point);
}

export function fromText(text: string): [GameObject | null, GameObject[]] {
    const objs: GameObject[] = [];
    let hero: GameObject | null = null;

    const lines = text.split('\n');

    let [x, y] = [0, 0];
    for (const line of lines) {
        for (const char of line) {
            if (char === '#') {
                objs.push(new Wall([x, y]));
            }
            if (char === '@') {
                objs.splice(0, 0, new Space([x, y]));
                hero = new Hero([x, y]);
            }
            if (char === 'l') {
                objs.splice(0, 0, new Space([x, y]));
                objs.push(randomLoot([x, y]));
            }
            if (char === ' ') {
                objs.splice(0, 0, new Space([x, y]));
            }
            if (char === '&') {
                objs.push(new Exit([x, y]));
            }
            if (char === 'M') {
                objs.splice(0, 0, new Space([x, y]));
                objs.push(new Urglorg([x, y]));
            }
            ++x;
        }
        ++y;
        x = 0;
    }

    return [hero, objs];
}
