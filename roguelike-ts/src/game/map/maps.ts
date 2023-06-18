import { GameObject } from '../../engine/elements/gameobject';
import { Random } from '../../engine/utils/random';
import { Space } from '../entites/env';
import { Hero } from '../entites/hero';
import { Heal, Loot, Weapon } from '../entites/items';
import { LootPlace } from '../entites/items/amunition';
import { FireBallLoot } from '../entites/items/fbloot';
import { HealSize } from '../entites/items/heal';
import { LootCharacteristics } from '../entites/items/loot';
import { FantasyMobFactory } from '../entites/mobs/fantasy/fantasyMobFactory';
import { ApocalypseMobFactory } from '../entites/mobs/apocalypse/apocalypseMobFactory';
import { CyberpunkMobFactory } from '../entites/mobs/cyberpunk/cyberpunkMobFactory';
import { MapMeta } from './meta';
import { AbstractMobFactory } from '../entites/mobs/abstractMobFactory';

/**
 * Описание оружия
 * @typedef {Array} WeaponDescriber
 * @property {LootPlace} - Место на теле для ношения
 * @property {string} - Название
 * @property {Partial<LootCharacteristics>} - Характеристики оружия
 */
type WeaponDescriber = [LootPlace, string, Partial<LootCharacteristics>];

/**
 * Массив с описаниями оружия
 * @type {WeaponDescriber[]}
 */
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

/**
 * Генерирует случайное оружие
 * @param {number[]} point - Координаты генеерации
 * @returns {Loot} - Лут с оружием
 */
function randomWeaponLoot(point: [number, number]): Loot {
    const idx = Math.floor(Math.random() * weapons.length);
    const record = weapons[idx];
    return new Weapon(point, ...record);
}

/**
 * Массив с описаниями эликсиров и их весами
 * @type {[HealSize, number][]}
 */
const healDist: [HealSize, number][] = [
    ['Small', 7],
    ['Medium', 2],
    ['Big', 1]
];

/**
 * Генерирует случайный элексир здоровья
 * @param {number[]} point - Координаты генерации
 * @returns {Loot} - Лут с эликсиром
 */
function randomPotionLoot(point: [number, number]): Loot {
    const size = Random.pickWithWeight(healDist);
    return new Heal(point, size);
}

/**
 * Генерирует случайное количество фаерболов
 * @param {number[]} point - Координаты генерации
 * @returns {Loot} - Лут с фаерболами
 */
function randomFireBallLoot(point: [number, number]): Loot {
    const count = Math.ceil(Math.random() * 10);
    return new FireBallLoot(point, count);
}

/**
 * Массив с генераторами случайного лута и их весами
 * @type {[(point: [number, number]) => Loot, number][]}
 */
const lootDist: [(point: [number, number]) => Loot, number][] = [
    [randomWeaponLoot, 3],
    [randomPotionLoot, 5],
    [randomFireBallLoot, 5]
];

/**
 * Генерирует случайный лут
 * @param {number[]} point - Координаты генерации
 * @returns {Loot} - Лут
 */
export function randomLoot(point: [number, number]): Loot {
    const func = Random.pickWithWeight(lootDist);
    return func(point);
}

/**
 * Генерирует карту из текстового представления
 * @param {string} text - Текстовое представление карты
 * @param {MapMeta} meta - Метаданные карты
 * @returns {[GameObject | null, GameObject[]]} - Сгенерированная карта
 */
export function fromText(
    text: string,
    meta: MapMeta = new MapMeta()
): [GameObject | null, GameObject[]] {
    const factories: Record<string, AbstractMobFactory> = {};

    if ('fantasy' in meta.mobMappings) {
        factories['fantasy'] = new FantasyMobFactory();
    }
    if ('apocalypse' in meta.mobMappings) {
        factories['apocalypse'] = new ApocalypseMobFactory();
    }
    if ('cyberpunk' in meta.mobMappings) {
        factories['cyberpunk'] = new CyberpunkMobFactory();
    }

    const objs: GameObject[] = [];
    let hero: GameObject | null = null;

    const lines = text.split('\n');

    let [x, y] = [0, 0];
    for (const line of lines) {
        for (const char of line) {
            if (char in meta.envMapping) {
                objs.push(meta.envMapping[char]([x, y]));
            }

            if (char in meta.lootMapping) {
                objs.push(meta.lootMapping[char]([x, y]));
            }

            if ('fantasy' in meta.mobMappings && char in meta.mobMappings['fantasy']) {
                objs.push(meta.mobMappings['fantasy'][char](factories['fantasy'], [x, y]));
            }
            if ('apocalypse' in meta.mobMappings && char in meta.mobMappings['apocalypse']) {
                objs.push(meta.mobMappings['apocalypse'][char](factories['apocalypse'], [x, y]));
            }
            if ('cyberpunk' in meta.mobMappings && char in meta.mobMappings['cyberpunk']) {
                objs.push(meta.mobMappings['cyberpunk'][char](factories['cyberpunk'], [x, y]));
            }

            if (char == meta.heroMark) {
                hero = new Hero([x, y]);
            }

            ++x;
        }
        ++y;
        x = 0;
    }

    const map : { [x:number] : { [y:number] : Space } } = { }
    for (let y = 0; y < lines.length; ++y) {
        for (let x = 0; x < lines[y].length; ++x) {
            const char = lines[y][x];
            if (meta.spaceMarks.has(char)) {
                continue;
            }

            const s =  new Space([x, y]);

            if (map[x - 1] && map[x - 1][y]) {
                s.addNeighbour('left', map[x - 1][y]);
            }
            if (map[x] && map[x][y - 1]) {
                s.addNeighbour('bottom', map[x][y - 1]);
            }

            objs.splice(0, 0, s);
            if (!(x in map)) {
                map[x] = { }
            }
            map[x][y] = s;
        }
    }

    return [hero, objs];
}
