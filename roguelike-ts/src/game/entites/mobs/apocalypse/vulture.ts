import { Mob } from '../mob';
import { Animatable, CanNotCollideWith, Forcable } from '../../../../engine/utils/traits';
import { repeat } from '../../../../engine/utils/traits/animable';
import { KeepDistance } from '../behavior';

/**
 * Класс моба стервятника, стиля апокалипсиса,
 * имеет поведение держания дистанции
 */
export class Vulture extends Mob {
    /**
     * Создаёт экземпляр стервятника
     * @param point место где создать экзмепляр
     */
    constructor(point: [number, number]) {
        super(point, 'vulture');
        this.behaviorState = new KeepDistance(this, (_: Mob) => false);
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
    @Animatable([
        ...repeat('v', 3),
        ...repeat('V', 3),
        ...repeat('Y', 3),
        ...repeat('T', 3),
        ...repeat('^', 5),
        ...repeat('-', 5),
        ...repeat('Y', 5),
        ...repeat('v', 3)
    ])
    update(t: number): void {
        this.behaviorState.update(t);
    }
}
