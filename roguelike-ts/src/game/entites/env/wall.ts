import { GameObject } from '../../../engine/elements/gameobject';
import { Animatable } from '../../../engine/utils/traits';
import { repeat } from '../../../engine/utils/traits/animable';

/**
 * Класс стены на карте
 * @extends GameObject
 */
export class Wall extends GameObject {
    /**
     * Создает новый экземпляр стены
     * @param {number} x - Координата x
     * @param {number} y - Координата y
     */
    constructor([x, y]: [number, number]) {
        super(['wall']);

        this.x = x;
        this.y = y;

        this.w = 1;
        this.h = 1;
    }

    @Animatable([...repeat('#', 10), ...repeat('%', 10)])
    override update(_: number): void {}
}
