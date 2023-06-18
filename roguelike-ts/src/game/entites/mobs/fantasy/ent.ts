import { Mob } from '../mob';
import { Animatable, CanNotCollideWith, Forcable } from '../../../../engine/utils/traits';
import { repeat } from '../../../../engine/utils/traits/animable';

/**
 * Класс моба энт, стиля фентези,
 * имеет пассивное поведение
 */
export class Ent extends Mob {
    /**
     * Создаёт экземпляр энта
     * @param point место где создать экзмепляр
     */
    constructor(point: [number, number]) {
        super(point, 'Ent');
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
    @Animatable([...repeat('T', 5), ...repeat('F', 5)])
    update(t: number): void {
        this.behaviorState.update(t);
    }
}
