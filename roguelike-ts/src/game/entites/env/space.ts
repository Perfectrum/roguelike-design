import { GameObject } from '../../../engine/elements/gameobject';

/**
 * Класс пустого пространства в игре
 * @extends GameObject
 */
export class Space extends GameObject {
    /**
     * Создает новый экземпляр пустого пространства
     * @param {number} x - Координата x
     * @param {number} y - Координата y
     */
    constructor([x, y]: [number, number]) {
        super(['space']);

        this.x = x;
        this.y = y;
        this.content = ' ';

        this.w = 1;
        this.h = 1;

        this.viewOnly = true;
    }

    update(_: number): void {}
}
