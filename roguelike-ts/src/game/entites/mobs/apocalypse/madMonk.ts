import { Mob } from '../mob';
import { Animatable, CanNotCollideWith, Forcable } from '../../../../engine/utils/traits';
import { repeat } from '../../../../engine/utils/traits/animable';
import { Confuse, Panic } from '../behavior';

export class MadMonk extends Mob {
    constructor(point: [number, number]) {
        super(point, 'MadMonk');
        this.behaviorState = new Confuse(
            this,
            (mob: Mob) => mob.hp <= mob.maxHP() * 0.3,
            new Panic(this, (mob: Mob) => mob.hp > mob.maxHP() * 0.3)
        );
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
    @Animatable([...repeat('&', 10), ...repeat('8', 10)])
    update(t: number): void {
        this.behaviorState.update(t);
    }
}
