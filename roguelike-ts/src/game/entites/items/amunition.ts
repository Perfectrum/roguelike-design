import { Loot, LootCharacteristics } from './loot';

/**
 * Тип данных, представляющий место ношения снаряжения на теле
 */
export type LootPlace = 'head' | 'rightHand' | 'leftHand' | 'body';

/**
 * Абстрактный класс, представляющий снаряжение, который можно надеть
 */
export abstract class WearsLoot extends Loot {
    /**
     * Место ношения снаряжения
     * @protected
     */
    protected place: LootPlace;

    /**
     * Создает экземпляр снаряжения
     * @param {[number, number]} point - Координаты
     * @param {LootPlace} place - Место ношения
     * @param {string} name - Название
     * @param {Partial<LootCharacteristics>} chs - Характеристики предмета (опционально)
     */
    constructor(
        point: [number, number],
        place: LootPlace,
        name: string,
        chs?: Partial<LootCharacteristics>
    ) {
        super(point, name, chs);
        this.place = place;

        this.content = 'm';
        this.contentBraces = ['{#ffd700-fg}', '{/}'];

        this.effect = (hero) => {
            hero.equip(this);
        };
    }

    getPlace() {
        return this.place;
    }
}

/**
 * Класс оружия
 */
export class Weapon extends WearsLoot {
    /**
     * Создает экземпляр оружия
     * @param {[number, number]} point - Координаты
     * @param {LootPlace} place - Место ношения оружия
     * @param {string} name - Название
     * @param {Partial<LootCharacteristics>} chs - Характеристики предмета (опционально)
     */
    constructor(
        point: [number, number],
        place: LootPlace,
        name: string,
        chs?: Partial<LootCharacteristics>
    ) {
        super(point, place, name, chs);
    }
}
