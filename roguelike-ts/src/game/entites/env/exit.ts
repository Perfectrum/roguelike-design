import { GameObject } from '../../../engine/elements/gameobject';

/**
 * Класс двери-выхода в игре
 * @extends GameObject
 */
export class Exit extends GameObject {
    /**
     * Создает новый выход
     * @param {number} x - Координата x
     * @param {number} y - Координата y
     */
    constructor([x, y]: [number, number]) {
        super(['exit', 'action']);

        this.x = x;
        this.y = y;
        this.content = '&';

        this.w = 1;
        this.h = 1;

        this.contentBraces = ['{#5f00ff-fg}', '{/}'];
    }

    update(_: number): void {}
}
