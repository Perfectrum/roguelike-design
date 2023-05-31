import { Loot, LootCharacteristics } from './loot';

export type HealSize = 'Small' | 'Medium' | 'Big';
export class Heal extends Loot {
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
