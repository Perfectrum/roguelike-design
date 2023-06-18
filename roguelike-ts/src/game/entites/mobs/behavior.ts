import { Mob } from '../mobs/mob';
import { Hero } from '../hero';

/**
 * Абстрактный класс, представляющий поведение моба с помощью паттерна Состояние
 * @abstract
 */
export abstract class Behavior {
    /**
     * Моб, управляемый поведением
     * @type {Mob}
     * @protected
     */
    protected mob: Mob;

    /**
     * Условие, определяющее переключение поведения
     * @type {(mob: Mob) => boolean}
     * @protected
     */
    protected condition: (mob: Mob) => boolean;

    /**
     * Следующее состояние поведения
     * @type {Behavior}
     * @protected
     */
    protected nextState: Behavior;

    /**
     * Создает новый экземпляр поведения
     * @param {Mob} mob - Моб, управляемый поведением
     * @param {(mob: Mob) => boolean} condition - Условие, определяющее, должно ли поведение переключиться на следующее
     * @param {Behavior} [nextState] - Следующее состояние поведения (опционально). Если следующее поведение не передано,
     * то при срабатывании условия моб перейдет в деволтное состояние
     */
    public constructor(mob: Mob, condition: (mob: Mob) => boolean, nextState?: Behavior) {
        this.mob = mob;
        this.condition = condition;
        if (nextState) {
            this.nextState = nextState;
        } else {
            this.nextState = this.mob.defaultBehaviorState;
        }
    }

    public abstract update(t: number): void;
}

/**
 * Аггресивное поведение, при котором моб охраняет точку, на которой стоит и
 * нападает при приближении героя, и возвращается при удалении
 */
export class Agressive extends Behavior {
    public update(_: number) {
        const hero = this.mob.lookFor('hero');

        if (!hero || !(hero instanceof Hero)) {
            return;
        }

        const hx = hero.getX();
        const hy = hero.getY();

        if (this.mob.distanceTo(hero) == 0) {
            hero.takeDamage(this.mob.damage);
        }

        if (
            hx <= this.mob.getInitX() + this.mob.visionRange &&
            this.mob.getInitX() - this.mob.visionRange <= hx &&
            hy <= this.mob.getInitY() + this.mob.visionRange &&
            this.mob.getInitY() - this.mob.visionRange <= hy
        ) {
            this.mob.push([Math.sign(hx - this.mob.getX()), Math.sign(hy - this.mob.getY())]);
        } else {
            this.mob.push([
                Math.sign(this.mob.getInitX() - this.mob.getX()),
                Math.sign(this.mob.getInitY() - this.mob.getY())
            ]);
        }

        if (this.condition(this.mob)) {
            this.mob.behaviorState = this.nextState;
        }
    }
}

/**
 * Поведение, при котором моб атакует героя при появлении того в поле зрения
 */
export class Attack extends Behavior {
    public update(_: number): void {
        const hero = this.mob.lookFor('hero');

        if (!hero || !(hero instanceof Hero)) {
            return;
        }

        if (this.mob.distanceTo(hero) == 0) {
            hero.takeDamage(this.mob.damage);
        }

        const hx = hero.getX();
        const hy = hero.getY();

        if (this.mob.distanceTo(hero) == 0) {
            hero.takeDamage(this.mob.damage);
        }

        this.mob.push([Math.sign(hx - this.mob.getX()), Math.sign(hy - this.mob.getY())]);

        if (this.condition(this.mob)) {
            this.mob.behaviorState = this.nextState;
        }
    }
}

/**
 * Сконфуженное поведение при котором моб перемещается в случайном направлении
 */
export class Confuse extends Behavior {
    public update(_: number) {
        if (Math.random() > 0.1) {
            this.mob.push([Math.sign(Math.random() * 2 - 1), Math.sign(Math.random() * 2 - 1)]);
        }

        if (this.condition(this.mob)) {
            this.mob.behaviorState = this.nextState;
        }
    }
}

/**
 * Поведение, при котором моб держится на расстоянии от игрока
 */
export class KeepDistance extends Behavior {
    public update(_: number) {
        const hero = this.mob.lookFor('hero');

        if (!hero || !(hero instanceof Hero) || this.mob.distanceTo(hero) > this.mob.visionRange) {
            return;
        }

        if (this.mob.distanceTo(hero) == 0) {
            hero.takeDamage(this.mob.damage);
        }

        if (this.mob.distanceTo(hero) < this.mob.visionRange / 2) {
            const hx = hero.getX();
            const hy = hero.getY();

            let dx = Math.sign(this.mob.getX() - hx);
            let dy = Math.sign(this.mob.getY() - hy);

            if (dx == 0) {
                dx = Math.sign(Math.random() * 2 - 1);
            }

            if (dy == 0) {
                dy = Math.sign(Math.random() * 2 - 1);
            }

            this.mob.push([dx, dy]);
        } else {
            this.mob.push([0, 0]);
        }

        if (this.condition(this.mob)) {
            this.mob.behaviorState = this.nextState;
        }
    }
}

/** Поведение, при котором моб убегает от игрока */
export class Panic extends Behavior {
    public update(_: number): void {
        const hero = this.mob.lookFor('hero');

        if (!hero || !(hero instanceof Hero) || this.mob.distanceTo(hero) > this.mob.visionRange) {
            return;
        }

        if (this.mob.distanceTo(hero) == 0) {
            hero.takeDamage(this.mob.damage);
        }

        const hx = hero.getX();
        const hy = hero.getY();

        let dx = Math.sign(this.mob.getX() - hx);
        let dy = Math.sign(this.mob.getY() - hy);

        if (dx == 0) {
            dx = Math.sign(Math.random() * 2 - 1);
        }

        if (hy == 0) {
            dy = Math.sign(Math.random() * 2 - 1);
        }

        this.mob.push([dx, dy]);

        if (this.condition(this.mob)) {
            this.mob.behaviorState = this.nextState;
        }
    }
}

/** Поведение, при котором моб игнорирует игрока */
export class Ignore extends Behavior {
    public update(_: number): void {
        if (this.condition(this.mob)) {
            this.mob.behaviorState = this.nextState;
        }
    }
}
