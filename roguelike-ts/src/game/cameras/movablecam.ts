import { Widgets } from 'blessed';
import { Camera } from '../../engine/elements/camera';

export class MovableCamera extends Camera {
    constructor(tags?: string[], ops?: Widgets.TextOptions) {
        super(tags, ops);
    }

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
