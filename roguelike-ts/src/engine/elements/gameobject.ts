import { Widgets } from 'blessed';

type UIElementFinder = (id: string) => Widgets.BlessedElement | undefined;
type GameObjectFinder = (tag: string) => GameObject | undefined;

export class Force {
    public x: number;
    public y: number;

    constructor(params?: { x?: number; y?: number }) {
        this.x = params?.x || 0;
        this.y = params?.y || 0;
    }

    static up(size = 1) {
        return new Force({ y: -size });
    }

    static down(size = 1) {
        return new Force({ y: size });
    }

    static left(size = 1) {
        return new Force({ x: -size });
    }

    static right(size = 1) {
        return new Force({ x: size });
    }
}

interface SceneController {
    findObject: GameObjectFinder;
    findUI: UIElementFinder;
    remove: () => void;
    sendSignal: (msg: string) => void;
    placeObject: (obj: GameObject) => void;
}

export abstract class GameObject {
    protected x: number;
    protected y: number;
    protected z: number;

    protected w: number;
    protected h: number;

    protected tags: string[];

    protected contentBraces: [string, string];
    protected content: string;

    protected findObject: GameObjectFinder;
    protected findUI: UIElementFinder;
    public remove: () => void;
    protected sendSignal: (msg: string) => void;
    protected placeObject: (obj: GameObject) => void;

    protected force: Force;
    protected willCollide: GameObject[];
    protected collide: GameObject[];

    public viewOnly: boolean;

    protected rate: number;

    protected constructor(tags?: string[]) {
        this.x = 0;
        this.y = 0;
        this.z = 0;

        this.w = 1;
        this.h = 1;

        this.tags = tags || [];
        this.content = ' ';

        this.findObject = () => undefined;
        this.findUI = () => undefined;
        this.remove = () => undefined;
        this.sendSignal = () => undefined;
        this.placeObject = () => undefined;

        this.force = new Force();

        this.willCollide = [];
        this.collide = [];

        this.viewOnly = false;

        this.contentBraces = ['', ''];
        this.rate = 1;
    }

    init() {}

    getUpdateRate() {
        return this.rate;
    }

    setPredictionCollision(objs: GameObject[]) {
        this.willCollide = objs;
    }

    setCurrentCollision(objs: GameObject[]) {
        this.collide = objs;
    }

    resetFutureCollision() {
        this.willCollide = [];
        return this;
    }

    resetCurrentCollision() {
        this.collide = [];
        return this;
    }

    getForce() {
        return this.force;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    getZ() {
        return this.z;
    }

    getW() {
        return this.w;
    }

    getH() {
        return this.h;
    }

    getCoords(): [number, number] {
        return [this.x, this.y];
    }

    getDrawBox(): [number, number, number, number] {
        return [this.x, this.y, this.w, this.h];
    }

    changeCoordsBy(dx: number, dy: number) {
        this.x += dx;
        this.y += dy;
        return this;
    }

    setCoords(x: number, y: number) {
        this.x = x;
        this.y = y;
        return this;
    }

    getContentStyle() {
        return this.contentBraces;
    }

    getContent() {
        let content = '';

        const lines = this.content.split('\n');
        for (let j = 0; j < this.h; ++j) {
            let curr = '';
            if (j < lines.length) {
                curr = lines[j];
            }
            content += curr;
            for (let i = curr.length; i < this.w; ++i) {
                content += ' ';
            }
        }

        return content;
    }

    setContent(content: string) {
        this.content = content;
    }

    containsTag(tag: string) {
        return this.tags.includes(tag);
    }

    bind(controller: SceneController) {
        this.findObject = controller.findObject;
        this.findUI = controller.findUI;
        this.remove = controller.remove;
        this.sendSignal = controller.sendSignal;
        this.placeObject = controller.placeObject;
    }

    findCollideWith(tag: string) {
        return this.collide.find((x) => x.containsTag(tag));
    }

    mockOther(other: GameObject | null) {
        if (!other) {
            return;
        }

        this.x = other.getX();
        this.y = other.getY();
    }

    keyPressed(_: Widgets.Events.IKeyEventArg) {}
    abstract update(dt: number): void;
    post(): void {}
    rateUpdate(): void {}
}
