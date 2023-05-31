import { GameObject } from '../../../engine/elements/gameobject';
import { Animatable } from '../../../engine/utils/traits';
import { repeat } from '../../../engine/utils/traits/animable';
import { Hero } from '../hero';

export abstract class Mob extends GameObject {
    public hp: number;
    public damage: number;
    public killed: boolean;

    public name: string;

    constructor([x, y]: [number, number], name: string) {
        super(['mob', 'danger']);

        this.x = x;
        this.y = y;
        this.z = 4;
        this.content = ' ';

        this.w = 1;
        this.h = 1;

        this.hp = this.maxHP();

        this.damage = 1;

        this.name = name;
        this.killed = false;
    }

    abstract maxHP(): number;
    abstract killXP(): number;
    abstract damageXP(): number;

    killScore() {
        return 11;
    }

    currentHP() {
        return this.hp;
    }

    getName() {
        return this.name;
    }

    takeDamage(dhp: number): number {
        this.hp -= dhp;
        if (this.hp <= 0) {
            this.remove();
            this.killed = true;
            return this.killXP();
        }
        return this.damageXP();
    }

    update(_: number): void {
        const hero = this.findCollideWith('hero');
        if (hero && hero instanceof Hero) {
            hero.takeDamage(this.damage);
        }
    }

    post(): void {}
}
