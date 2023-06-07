import { Mob } from '../mob';
import { Animatable, CanNotCollideWith, Forcable } from '../../../../engine/utils/traits';
import { repeat } from '../../../../engine/utils/traits/animable';
import { Attack, KeepDistance } from '../behavior';

export class Harpy extends Mob {
    constructor(point: [number, number]) {
        super(point, 'Harpy');
        this.visionRange = 15;

        this.behaviorState = new KeepDistance(
            this,
            (_: Mob) => Math.random() > 0.1,
            new Attack(this, (mob: Mob) => mob.hp < mob.maxHP() * 0.3)
        );
        this.defaultBehaviorState = this.behaviorState;
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
    @Animatable([...repeat('|', 5), ...repeat('Y', 5), ...repeat('U', 5), ...repeat('Y', 5)])
    update(t: number): void {
        this.behaviorState.update(t);
    }
}
