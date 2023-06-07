import { Mob } from '../mob';
import { Animatable, CanNotCollideWith, Forcable } from '../../../../engine/utils/traits';
import { repeat } from '../../../../engine/utils/traits/animable';
import { Agressive, Panic } from '../behavior';

export class Ork extends Mob {
    constructor(point: [number, number]) {
        super(point, 'Ork');

        this.behaviorState = new Agressive(
            this,
            (mob: Mob) => mob.hp <= mob.maxHP() * 0.25,
            new Panic(this, (mob: Mob) => mob.hp > mob.maxHP() * 0.5)
        );
        this.defaultBehaviorState = this.behaviorState;

        const [x, y] = point;
        this.initX = x;
        this.initY = y;

        this.visionRange = 5;
        this.damage = 3;
        this.rate = 5;
    }

    public maxHP(): number {
        return 20;
    }

    public killXP(): number {
        return 20;
    }

    public damageXP(): number {
        return 0;
    }

    @CanNotCollideWith(['wall'])
    @Forcable()
    @Animatable([...repeat('A', 10), ...repeat('4', 3)])
    update(t: number): void {
        this.behaviorState.update(t);
    }
}
