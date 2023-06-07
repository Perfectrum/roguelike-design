import { Mob } from '../mob';
import { Animatable, CanNotCollideWith, Forcable } from '../../../../engine/utils/traits';
import { repeat } from '../../../../engine/utils/traits/animable';

export class Drone extends Mob {
    constructor(point: [number, number]) {
        super(point, 'Drone');
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
    @Animatable([...repeat('$', 5), ...repeat('S', 5)])
    update(t: number): void {
        this.behaviorState.update(t);
    }
}
