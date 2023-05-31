import { GameObject } from '../../../engine/elements/gameobject';
import { Hero } from '../hero';

export interface LootCharacteristics {
    damage: number;
    armor: number;
}

export abstract class Loot extends GameObject {
    private chs: LootCharacteristics;
    private name: string;

    public effect: (h: Hero) => void;

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
