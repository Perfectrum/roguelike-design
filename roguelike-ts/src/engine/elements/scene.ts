import blessed, { Widgets } from 'blessed';
import { Camera } from './camera';
import { GameObject } from './gameobject';

type ViewPortEntity = {
    x: number;
    y: number;
    w: number;
    h: number;

    content: string;
};

export class Scene {
    private objects: GameObject[];
    private cameras: Camera[];
    private box: Widgets.BoxElement;
    private storage: { [x: string]: Widgets.BlessedElement };
    public readonly init: () => void;
    public readonly event: (msg: string) => void;

    constructor(init?: () => void, event?: (msg: string) => void) {
        this.objects = [];
        this.cameras = [];
        this.box = blessed.box();
        this.storage = {};
        this.init = init || (() => undefined);
        this.event = event || (() => undefined);
    }

    rememberUI(id: string, element: Widgets.BlessedElement) {
        this.storage[id] = element;
    }

    addUI(element: Widgets.BlessedElement) {
        this.box.append(element);
    }

    addCamera(camera: Camera) {
        if (!camera.isViewPortBinded()) {
            this.box.append(camera.bindViewPort());
        }
        this.cameras.push(camera);
    }

    add(object: GameObject) {
        object.bind({
            findObject: (tag) => this.objects.find((x) => x.containsTag(tag)),
            findUI: (id) => this.storage[id],
            remove: () => this.remove(object),
            sendSignal: (msg) => this.event(msg),
            placeObject: (obj) => this.add(obj)
        });
        this.objects.push(object);
        object.init();
    }

    load(objects: GameObject[]) {
        for (const obj of objects) {
            this.add(obj);
        }
    }

    remove(object: GameObject) {
        this.objects = this.objects.filter((x) => x !== object);
    }

    getObjects() {
        return this.objects.concat(this.cameras);
    }

    getPhysicsObjects() {
        return this.objects.concat(this.cameras).filter((x) => !x.viewOnly);
    }

    getBox() {
        return this.box;
    }

    getViewPortEntities(): [Widgets.BlessedElement, ViewPortEntity[]][] {
        const res: [Widgets.BlessedElement, ViewPortEntity[]][] = [];

        for (const camera of this.cameras) {
            const objects = this.objects
                .filter((obj) => camera.frameContains(obj.getDrawBox()))
                .map((obj) => ({
                    x: obj.getX() - camera.getX(),
                    y: obj.getY() - camera.getY(),
                    w: obj.getW(),
                    h: obj.getH(),

                    content: obj.getContent()
                }));

            res.push([camera.getViewPort(), objects]);
        }

        return res;
    }
}
