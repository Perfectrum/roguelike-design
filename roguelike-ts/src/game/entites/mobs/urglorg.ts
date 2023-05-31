import { Force } from '../../../engine/elements/gameobject';
import { Animatable, CanNotCollideWith, Forcable } from '../../../engine/utils/traits';
import { repeat } from '../../../engine/utils/traits/animable';
import { Mob } from './mob';

export class Urglorg extends Mob {
    private tx: number;
    private ty: number;

    private range: number;

    constructor(point: [number, number]) {
        super(point, 'Urglorg');

        const [x, y] = point;
        this.tx = x;
        this.ty = y;

        this.range = 5;

        this.damage = 3;

        this.rate = 5;
    }

    maxHP(): number {
        return 20;
    }
    killXP(): number {
        return 20;
    }
    damageXP(): number {
        return 0;
    }

    killScore(): number {
        return 10;
    }

    @CanNotCollideWith(['wall'])
    @Forcable()
    @Animatable([...repeat('P', 2), ...repeat('d', 2)])
    update(t: number): void {
        super.update(t);

        const hero = this.findObject('hero');
        if (!hero) {
            return;
        }

        const hx = hero.getX();
        const hy = hero.getY();

        if (
            hx <= this.tx + this.range &&
            this.tx - this.range <= hx &&
            hy <= this.ty + this.range &&
            this.ty - this.range <= hy
        ) {
            this.force.x = Math.sign(hx - this.x);
            this.force.y = Math.sign(hy - this.y);
        } else {
            this.force.x = Math.sign(this.tx - this.x);
            this.force.y = Math.sign(this.ty - this.y);
        }
    }
}
