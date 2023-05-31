import { Loot, LootCharacteristics } from './loot';

export type LootPlace = 'head' | 'rightHand' | 'leftHand' | 'body';

export abstract class WearsLoot extends Loot {
    protected place: LootPlace;

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

export class Weapon extends WearsLoot {
    constructor(
        point: [number, number],
        place: LootPlace,
        name: string,
        chs?: Partial<LootCharacteristics>
    ) {
        super(point, place, name, chs);
    }
}
