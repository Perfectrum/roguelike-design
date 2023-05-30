import blessed, { Widgets } from 'blessed';
import { GameObject } from './gameobject';

export class Camera extends GameObject {
    protected viewPort: Widgets.TextElement;
    protected viewPortBinded: boolean;

    constructor(tags?: string[], options?: Widgets.TextOptions) {
        super(tags);

        this.w = 3;
        this.h = 3;

        this.viewPort = blessed.text(options);
        this.viewPortBinded = false;
    }

    frameContains(box: [number, number, number, number]): boolean {
        const [x, y, w, h] = box;

        const checkPoint = ([x, y]: [number, number]) => {
            return x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h;
        };

        return (
            checkPoint([x, y]) ||
            checkPoint([x + w, y]) ||
            checkPoint([x, y + h]) ||
            checkPoint([x + w, y + h])
        );
    }

    bindViewPort() {
        this.viewPortBinded = true;
        return this.viewPort;
    }

    isViewPortBinded() {
        return this.viewPortBinded;
    }

    getViewPort() {
        return this.viewPort;
    }

    override update(_: number): void {
        if (typeof this.viewPort.width === 'number') {
            this.w = this.viewPort.width;
        }
        if (typeof this.viewPort.height === 'number') {
            this.h = this.viewPort.height;
        }
    }
}
