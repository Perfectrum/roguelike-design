import { GameObject } from '../../engine/elements/gameobject';
import { Hero } from './hero';

interface LootCharacteristics {
    damage: number;
    armor: number;
}

export type LootPlace = 'head' | 'rightHand' | 'leftHand' | 'body';

export class Loot extends GameObject {
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

        this.content = 'n';
        this.effect = (hero) => {
            hero.heal(5);
        };
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

    update(_: number): void {}
}
