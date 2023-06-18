import blessed, { Widgets } from 'blessed';
import { Camera } from '../elements/camera';
import { Scene } from '../elements/scene';

/**
 * Интерфейс тулкита для UI
 */
interface ToolKitItem {
    elements: Widgets.BlessedElement[];
    cameras: Camera[];
    storage: { [id: string]: Widgets.BlessedElement };
}

function elem(elm: Widgets.BlessedElement, id?: string): ToolKitItem {
    return {
        elements: [elm],
        cameras: [],
        storage: id ? { [id]: elm } : {}
    };
}

function cam(tags?: string[], options?: Widgets.TextOptions): ToolKitItem {
    return {
        elements: [],
        cameras: [new Camera(tags, options)],
        storage: {}
    };
}

interface SceneOptions {
    init?: () => void;
    event?: (msg: string) => void;
}

export const $ = {
    scene:
        (ops?: SceneOptions) =>
        (...nodes: ToolKitItem[]) => {
            const s = new Scene(ops?.init, ops?.event);
            for (const node of nodes) {
                for (const cam of node.cameras) {
                    s.addCamera(cam);
                }
                for (const elm of node.elements) {
                    s.addUI(elm);
                }
                for (const id in node.storage) {
                    s.rememberUI(id, node.storage[id]);
                }
            }
            return s;
        },
    box:
        (ops?: Widgets.BoxOptions) =>
        (...nodes: ToolKitItem[]): ToolKitItem => {
            const box = blessed.box(ops);

            const cams: Camera[] = [];
            const storage: { [x: string]: Widgets.BlessedElement } = {};
            for (const node of nodes) {
                for (const elm of node.elements) {
                    box.append(elm);
                }
                for (const cam of node.cameras) {
                    if (!cam.isViewPortBinded()) {
                        box.append(cam.bindViewPort());
                    }
                    cams.push(cam);
                }
                for (const id in node.storage) {
                    storage[id] = node.storage[id];
                }
            }

            return {
                elements: [box],
                cameras: cams,
                storage: storage
            };
        },
    camera: (ops?: Widgets.TextOptions) => (tags?: string[]) => cam(tags, ops),
    customCamera:
        () =>
        (camera: Camera): ToolKitItem => ({ elements: [], cameras: [camera], storage: {} }),
    text: (ops?: Widgets.TextOptions & { id?: string }) => (text: string) => {
        const e = blessed.text(ops);
        e.setContent(text);
        return elem(e, ops?.id);
    },
    textbox: (ops?: Widgets.TextboxOptions) => () => {
        const tb = blessed.textbox(ops);
        return elem(tb);
    },
    use: (props?: { id?: string }) => (widget: Widgets.BlessedElement) => elem(widget, props?.id)
};
