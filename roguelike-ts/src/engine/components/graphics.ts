import { Scene } from '../elements/scene';
import blessed, { Widgets } from 'blessed';

export type RenderFunc = (s: Scene) => void;

export function createRender(screen: Widgets.Screen) {
    return function (scene: Scene) {
        const objs = scene.getViewPortEntities();

        for (const [element, entites] of objs) {
            if (typeof element.width !== 'number') {
                continue;
            }

            if (typeof element.height !== 'number') {
                continue;
            }

            const text: string[][] = [];
            for (let i = 0; i < element.height; ++i) {
                const line: string[] = [];
                for (let j = 0; j < element.width; ++j) {
                    line.push('.');
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
                        text[obj.y + j][obj.x + i] = obj.content[j * obj.w + i];
                    }
                }
            }

            element.setText(text.map((x) => x.join('')).join('\n'));
        }

        screen.render();
    };
}
