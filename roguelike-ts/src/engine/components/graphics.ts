import { Scene } from '../elements/scene';
import blessed, { Widgets } from 'blessed';

export type RenderFunc = (s: Scene) => void;

interface RenderScreenLike {
    render():void;
}

/**
 * Создаёт функцию отрисовки экрана
 * @param screen - переданный экзепляр экрана
 * @returns функцию отрисовки
 */
export function createRender(screen: RenderScreenLike) {
    return function (scene: Scene) {
        const objs = scene.getViewPortEntities();

        for (const [element, entites] of objs) {
            if (typeof element.width !== 'number') {
                continue;
            }

            if (typeof element.height !== 'number') {
                continue;
            }

            const text: [string, number][][] = [];
            for (let i = 0; i < element.height; ++i) {
                const line: [string, number][] = [];
                for (let j = 0; j < element.width; ++j) {
                    line.push(['.', -1]);
                }
                text.push(line);
            }

            for (const obj of entites) {
                for (let j = 0; j < obj.h; ++j) {
                    for (let i = 0; i < obj.w; ++i) {
                        if (
                            obj.x + i < 0 ||
                            obj.x + i >= element.width ||
                            obj.y + j < 0 ||
                            obj.y + j >= element.height
                        ) {
                            continue;
                        }

                        const idx = j * obj.w + i;
                        if (idx < 0 || idx >= obj.content.length) {
                            continue;
                        }

                        const cell = text[obj.y + j][obj.x + i];
                        if (cell[1] <= obj.z) {
                            cell[0] = `${obj.tags[0]}${obj.content[j * obj.w + i]}${obj.tags[1]}`;
                            cell[1] = obj.z;
                        }
                    }
                }
            }

            element.setContent(text.map((x) => x.map(([t, _]) => t).join('')).join('\n'));
        }

        screen.render();
    };
}
