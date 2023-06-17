import { GameObject } from '../../../engine/elements/gameobject';
import { Hero } from '../hero';

/**
 * Интерфейс характеристик лута
 */
export interface LootCharacteristics {
    damage: number;
    armor: number;
}

/**
 * Абстрактный класс, представляющий предмет
 */
export abstract class Loot extends GameObject {
    private chs: LootCharacteristics;

    /**
     * Название предмета
     * @private
     */
    private name: string;
    
    /**
     * Эффект, который предмет оказывает на героя
     * @public
     */
    public effect: (h: Hero) => void;

    /**
     * Создает экземпляр предмета
     * @param {[number, number]} coordinates - Координаты
     * @param {string} name - Название предмета
     * @param {Partial<LootCharacteristics>} chs - Характеристики предмета (опционально)
     */
    constructor([x, y]: [number, number], name: string, chs?: Partial<LootCharacteristics>) {
        super(['loot', 'action']);

        this.name = name;
        this.chs = {
            armor: chs?.armor || 0,
            damage: chs?.damage || 0
        };

        this.x = x;
        this.y = y;
        this.z = 1;

        this.content = 'n';
        this.effect = () => {};
    }

    getName() {
        return this.name;
    }

    getDamage() {
        return this.chs.damage;
    }

    getArmor() {
        return this.chs.armor;
    }

    getDescription() {
        let text = '[ ';
        if (this.chs.damage) {
            text += `dmg: +${this.chs.damage}`;
        }
        text += ' | ';
        if (this.chs.armor) {
            text += `arm: +${this.chs.armor}`;
        }

        return text + ' ]';
    }

    update(_: number): void {}
}
