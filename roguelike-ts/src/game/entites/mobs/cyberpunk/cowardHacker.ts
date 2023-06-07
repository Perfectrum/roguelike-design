import { Mob } from '../mob';
import { Animatable, CanNotCollideWith, Forcable } from '../../../../engine/utils/traits';
import { repeat } from '../../../../engine/utils/traits/animable';
import { Panic } from '../behavior';

export class CowardHacker extends Mob {
    constructor(point: [number, number]) {
        super(point, 'CowardHacker');
        this.behaviorState = new Panic(this, (_: Mob) => false);
    }

    public maxHP(): number {
        return 5;
    }

    public killXP(): number {
        return 5;
    }

    public damageXP(): number {
        return 0;
    }

    @CanNotCollideWith(['wall'])
    @Forcable()
    @Animatable([...repeat('L', 10), ...repeat('_', 5), ...repeat('<', 5)])
    update(t: number): void {
        this.behaviorState.update(t);
    }
}
