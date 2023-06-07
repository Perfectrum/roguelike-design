import { GameObject } from '../../../engine/elements/gameobject';
import { Behavior, Panic, Ignore } from './behavior';

export abstract class Mob extends GameObject {
    public behaviorState: Behavior;
    public defaultBehaviorState: Behavior;

    protected initX: number;
    protected initY: number;

    public hp: number;
    public damage: number;
    public killed: boolean;
    public visionRange: number;

    public name: string;

    constructor([x, y]: [number, number], name: string) {
        super(['mob', 'danger']);
        this.defaultBehaviorState = new Ignore(
            this,
            (mob: Mob) => mob.hp <= mob.maxHP() * 0.3,
            new Panic(this, (mob: Mob) => mob.hp > mob.maxHP() * 0.3)
        );
        this.behaviorState = this.defaultBehaviorState;

        this.initX = x;
        this.initY = y;

        this.x = x;
        this.y = y;
        this.z = 4;
        this.visionRange = 10;
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

    public push([x, y]: [number, number]): void {
        this.force.x = x;
        this.force.y = y;
    }

    killScore() {
        return 11;
    }

    currentHP() {
        return this.hp;
    }

    getName() {
        return this.name;
    }

    getInitX() {
        return this.initX;
    }

    getInitY() {
        return this.initY;
    }

    public distanceTo(target: GameObject): number {
        return Math.abs(target.getX() - this.x) + Math.abs(target.getY() - this.y);
    }

    public lookFor(target: string) {
        const obj = this.findObject(target);
        if (!obj) {
            return undefined;
        }

        if (this.distanceTo(obj) <= this.visionRange) {
            return obj;
        }
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

    abstract update(t: number): void;
}
