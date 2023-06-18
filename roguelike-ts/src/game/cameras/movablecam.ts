import { Widgets } from 'blessed';
import { Camera } from '../../engine/elements/camera';

/**
 * Камера, которую можно двигать нажатиями клавиш (удобна для отладки генерации карты,
 * в игре сейчас не используется)
 * @extends Camera
 */
export class MovableCamera extends Camera {
    /**
     * Создает новый экземпляр подвижной камеры
     * @param {string[]} [tags] - Теги игрового объекта
     * @param {Widgets.TextOptions} [ops] - Опции для настройки viewport
     */
    constructor(tags?: string[], ops?: Widgets.TextOptions) {
        super(tags, ops);
    }

    /**
     * Обрабатывает нажатие клавиши
     * @param {Widgets.Events.IKeyEventArg} key - Информация о нажатой клавише
     */
    keyPressed(key: Widgets.Events.IKeyEventArg): void {
        if (key.name === 'i') {
            this.y -= 1;
        }
        if (key.name === 'k') {
            this.y += 1;
        }
        if (key.name === 'j') {
            this.x -= 1;
        }
        if (key.name === 'l') {
            this.x += 1;
        }
    }

    override update(dt: number): void {
        super.update(dt);
    }
}
