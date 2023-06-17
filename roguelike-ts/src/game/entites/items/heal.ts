import { Loot, LootCharacteristics } from './loot';

/**
 * Тип, определяющий интенсивность лечения
 */
export type HealSize = 'Small' | 'Medium' | 'Big';

/**
 * Класс, представляющий лечащий предмет
 */
export class Heal extends Loot {
    /**
     * Создает экземпляр лечения
     * @param {[number, number]} point - Координаты предмета
     * @param {HealSize} size - Размер лечения (по умолчанию 'Small')
     * @param {Partial<LootCharacteristics>} chs - Характеристики предмета (необязательно)
     */
    constructor(
        point: [number, number],
        size: HealSize = 'Small',
        chs?: Partial<LootCharacteristics>
    ) {
        super(point, `${size} Heal`, chs);

        this.contentBraces = ['{green-fg}', '{/}'];

        this.content = 'n';
        if (size === 'Big') {
            this.content = 'N';
        }

        this.effect = (h) => {
            if (size === 'Small') {
                h.heal(5);
            }
            if (size === 'Medium') {
                h.heal(20);
            }
            if (size === 'Big') {
                h.heal(50);
            }
        };
    }
}
