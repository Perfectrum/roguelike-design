import { GameObject } from '../../engine/elements/gameobject';
import { Animatable } from '../../engine/utils/traits';
import { Hero } from './hero';

function repeat(sym: string, n: number) {
    const res: string[] = [];
    while (--n) {
        res.push(sym);
    }
    return res;
}

export class Mob extends GameObject {
    public hp: number;

    constructor([x, y]: [number, number]) {
        super(['mob', 'danger']);

        this.x = x;
        this.y = y;
        this.content = ' ';

        this.w = 1;
        this.h = 1;

        this.hp = 5;
    }

    takeDamage(dhp: number): number {
        this.hp -= dhp;
        if (this.hp <= 0) {
            this.remove();
            return 15;
        }
        return 0;
    }

    @Animatable([...repeat('W', 2), ...repeat('M', 2)])
    update(_: number): void {
        const hero = this.findCollideWith('hero');
        if (hero && hero instanceof Hero) {
            hero.takeDamage(1);
        }
    }

    post(): void {}
}
