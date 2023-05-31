import { Loot } from './loot';

export class FireBallLoot extends Loot {
    private count: number;

    constructor(point: [number, number], count = 1) {
        super(point, `Fireball (x${count})`);
        this.count = count;

        this.content = 'e';
        this.contentBraces = ['{#ff00d7-fg}', '{/}'];

        this.effect = (h) => {
            h.giveFireBall(this.count);
        };
    }
}
