import { Mob } from '../mob';
import { Animatable, CanNotCollideWith, Forcable } from '../../../../engine/utils/traits';
import { repeat } from '../../../../engine/utils/traits/animable';
import { Attack } from '../behavior';

/**
 * Класс моба зомби, стиля апокалипсиса,
 * имеет агрессивное поведение
 */
export class Zombie extends Mob {
    /**
     * Создаёт экземпляр зомби
     * @param point место где создать экзмепляр
     */
    constructor(point: [number, number]) {
        super(point, 'Zombie');
        this.behaviorState = new Attack(this, (_: Mob) => false);
        this.damage = 1;
        this.visionRange = 3;
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
    @Animatable([...repeat('Z', 10), ...repeat('7', 10)])
    update(t: number): void {
        this.behaviorState.update(t);
    }
}
