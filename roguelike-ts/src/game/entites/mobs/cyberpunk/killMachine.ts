import { Mob } from '../mob';
import { Animatable, CanNotCollideWith, Forcable } from '../../../../engine/utils/traits';
import { repeat } from '../../../../engine/utils/traits/animable';
import { Attack, Agressive } from '../behavior';


/**
 * Класс моба машина убийств, стиля киберпанк,
 * имеет агрессивное поведение
 */
export class KillMachine extends Mob {
    /**
     * Создаёт экземпляр машина убийств
     * @param point - место где создать экземпляр
     */
    constructor(point: [number, number]) {
        super(point, 'KillMachine');
        this.damage = 3;
        this.behaviorState = new Attack(
            this,
            (mob: Mob) => mob.hp <= mob.maxHP() * 0.3,
            new Agressive(this, (mob: Mob) => mob.hp > mob.maxHP() * 0.5)
        );
    }

    public maxHP(): number {
        return 30;
    }

    public killXP(): number {
        return 30;
    }

    public damageXP(): number {
        return 0;
    }

    @CanNotCollideWith(['wall'])
    @Forcable()
    @Animatable([...repeat('R', 5), ...repeat('K', 5), ...repeat('k', 5), ...repeat('K', 5)])
    update(t: number): void {
        this.behaviorState.update(t);
    }
}
