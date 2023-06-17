import { Widgets } from 'blessed';
import { Camera } from '../../engine/elements/camera';
import { GameObject } from '../../engine/elements/gameobject';

/**
 * Камера, прикрепленная к игроку
 * @extends Camera
 */
export class ObjectLinkedCamera extends Camera {
    /**
     * Объект, к которому прикреплена камера
     */
    private hero: GameObject;

    /**
     * Создает новый экземпляр камеры
     * @param {string[]} [tags] - Теги игрового объекта
     * @param {Widgets.TextOptions} [ops] - Опции для настройки viewport
     */
    constructor(hero: GameObject, tags?: string[], ops?: Widgets.TextOptions) {
        super(tags, ops);

        this.hero = hero;
    }

    update(dt: number): void {
        super.update(dt);

        const hx = this.hero.getX();
        const hy = this.hero.getY();

        const w2 = Math.floor(this.w / 2);
        const h2 = Math.floor(this.h / 2);

        this.x = hx - w2;
        this.y = hy - h2;
    }
}
