import blessed, { Widgets } from 'blessed';
import { Game } from '../src/engine/game';
import { GameObject } from '../src/engine/elements/gameobject';
import { Scene } from '../src/engine/elements/scene';
import { Camera } from '../src/engine/elements/camera';

let screen: Widgets.Screen | null = null;

beforeEach(() => {
    screen = blessed.screen();
});

afterEach(() => {
    screen?.destroy();
});

describe("General engine tests", () => {

    test("Can init Game", () => {
        
        const g = new Game([ 'q' ], screen!);

        expect(() => {
            g.start();
            g.stop();
        }).not.toThrow();
    });
});

class FakeGameObject extends GameObject {
    initCalled = 0;
    bindCalled = 0;
    constructor(viewOnly=false) {
        super(['fake']);
        this.viewOnly = viewOnly;
    }
    set(x:number, y:number) {
        this.x = x;
        this.y = y;
        return this; 
    }
    init() {
        this.initCalled++;
    }
    bind(controller:any) {
        this.bindCalled++;
        super.bind(controller);
    }
    update(_: number): void {}
}

class FakeCamera extends Camera {
    constructor(w = 10, h = 10) {
        super(['fakeCam']);

        this.w = w;
        this.h = h;
    }
}

describe("GameObject tests", () => {

    test("Can create object", () => {
        expect(() => {
            new FakeGameObject();
        }).not.toThrow();
    });

    test("Camera is GameObject", () => {
        expect(() => {
            new Camera();
        });
    });

    test("Can move GameObject", () => {
        const obj = new FakeGameObject();
        obj.setCoords(3, 4);

        expect(obj.getX()).toBe(3);
        expect(obj.getY()).toBe(4);

        obj.changeCoordsBy(1, 1);

        expect(obj.getX()).toBe(4);
        expect(obj.getY()).toBe(5);
    });

    test("Can get basic props", () => {
        const obj = new FakeGameObject();
        obj.setContent("@");

        expect(obj.containsTag('fake')).toBe(true);
        expect(obj.getContent()).toBe('@');
    });

    test("Can mock other object", () => {
        const a = new FakeGameObject();
        a.setCoords(5, 5);

        const b = new FakeGameObject().mockOther(a);

        expect(b.getX()).toBe(5);
        expect(b.getY()).toBe(5);
    })
});

describe("Camera tests", () => {
    
    test("Can create camera", () => {
        expect(() => {
            new FakeCamera();
        }).not.toThrow();
    });

    test("Can determine frame", () => {

        const c = new FakeCamera(3, 10);

        expect(c.frameContains([1, 1, 10, 10])).toBe(true);
        expect(c.frameContains([0, 0, 1, 1])).toBe(true);
        expect(c.frameContains([-20, 30, 1, 1])).toBe(false);

    });
});

describe("Scene tests", () => {

    test("Can create new Scene", () => {
        const s = new Scene();

        expect(() => {
            s.init();
        }).not.toThrow();
    });

    test("Can add GameObject", () => {

        const obj = new FakeGameObject();

        const scene = new Scene();
        scene.add(obj);

        expect(obj.initCalled).toBe(1);
        expect(obj.bindCalled).toBe(1);
    });

    test("Can add GameObject array", () => {

        const objs = [
            new FakeGameObject(),
            new FakeGameObject(),
            new FakeGameObject()
        ];

        const scene = new Scene();
        scene.load(objs);

        for (const obj of objs) {
            expect(obj.initCalled).toBe(1);
            expect(obj.bindCalled).toBe(1);
        }
    });

    test("Can reattach GameObject", () => {
        const x = new FakeGameObject();

        const a = new Scene();
        const b = new Scene();

        a.add(x);

        expect(x.initCalled).toBe(1);
        expect(x.bindCalled).toBe(1);

        x.remove();

        b.add(x);

        expect(x.initCalled).toBe(2);
        expect(x.bindCalled).toBe(2);
    });

    test("Can add camera", () => {
        
        const c = new FakeCamera();
        const s = new Scene();

        expect(() => {
            s.addCamera(c);
        }).not.toThrow();
    });

    test("Can add cameras", () => {

        const cs = [
            new FakeCamera(),
            new FakeCamera(),
            new FakeCamera()
        ];

        const s = new Scene();

        expect(() => {
            for (const cam of cs) {
                s.addCamera(cam);
            }
        }).not.toThrow();

    }); 

    function eqStrict(a:any) {
        return (b:any) => {
            for (const key in a) {
                if (a[key] !== b[key]) {
                    return false;
                }
            }
            return true;
        }
    }

    function eqReg(a:any) {
        return (b:any) => a === b;
    }

    function unorderedEq(a:any[], b:any[], strict = false) {
        if (a.length !== b.length) {
            return false;
        }

        for (const item of a) {
            const idx = b.findIndex(strict ? eqStrict(item) : eqReg(item));
            if(idx >= 0) {
                b.splice(idx, 1); 
            }
        }
        return b.length === 0;
    }

    test("Can get objects", () => {

        const objs = [
            new FakeGameObject(),
            new FakeGameObject(),
            new FakeGameObject(),
            new FakeGameObject(),
        ];

        const cams = [
            new FakeCamera(),
            new FakeCamera()
        ];

        const scene = new Scene();
        scene.load(objs);
        
        for (const cam of cams) {
            scene.addCamera(cam);
        }

        expect(unorderedEq(scene.getObjects(), (objs as GameObject[]).concat(cams))).toBe(true);
    });

    test("Can get physics objects", () => {

        const viewOnlyObjs = [
            new FakeGameObject(true),
            new FakeGameObject(true),
        ];

        const regularObjs = [
            new FakeGameObject(),
            new FakeGameObject(),
        ];

        const objs = regularObjs.concat(viewOnlyObjs);

        const scene = new Scene();
        scene.load(objs);

        expect(unorderedEq(scene.getPhysicsObjects(), regularObjs)).toBe(true);
    });

    test("Can get viewport elements [no camera]", () => {
        const scene = new Scene();

        const objs = [
            new FakeGameObject(),
            new FakeGameObject(),
            new FakeGameObject(),
            new FakeGameObject(),
        ];

        scene.load(objs);

        expect(() => {
            const elements = scene.getViewPortEntities();
            expect(elements.length).toBe(0);
        }).not.toThrow();
    });

    test("Can get viewport elements [one camera]", () => {
        const scene = new Scene();

        const expected = [
            new FakeGameObject().set(3, 3),
            new FakeGameObject().set(5, 5),
            new FakeGameObject().set(0, 0),
        ]

        const objs = [
            new FakeGameObject().set(20, 20),
        ].concat(expected);

        scene.addCamera(new FakeCamera());
        scene.load(objs);

        const elements = scene.getViewPortEntities();
        expect(elements.length).toBe(1);

        const [_, items] = elements[0];

        function doObjMap(o:GameObject) {
            return { x : o.getX(), y : o.getY() };
        }

        function doItemMap(e:any) {
            return { x : e.x, y : e.y };   
        }

        expect(unorderedEq(expected.map(doObjMap), items.map(doItemMap), true)).toBe(true);
    });

    test("Can get viewport elements [many cameras]", () => {
        
        const scene = new Scene();

        const expectedCam1 = [
            new FakeGameObject().set(3, 3),
            new FakeGameObject().set(0, 0),
        ];

        const expectedCam2 = [
            new FakeGameObject().set(5, 5),
        ].concat(expectedCam1);

        const objs = [
            new FakeGameObject().set(20, 20),
        ].concat(expectedCam2);

        scene.addCamera(new FakeCamera(4, 4));
        scene.addCamera(new FakeCamera(10, 10));
        scene.load(objs);

        const elements = scene.getViewPortEntities();
        expect(elements.length).toBe(2);

        function doObjMap(o:GameObject) {
            return { x : o.getX(), y : o.getY() };
        }

        function doItemMap(e:any) {
            return { x : e.x, y : e.y };   
        }

        const expected = [
            expectedCam1,
            expectedCam2
        ];

        let i = 0;
        for (const [_, items] of elements) {
            expect(unorderedEq(expected[i].map(doObjMap), items.map(doItemMap), true)).toBe(true);
            ++i;
        }
    });
});

class FinderGameObject extends GameObject {
    constructor(tag:string) {
        super([tag]);
    }

    find(tag:string) {
        return this.findObject(tag);
    }

    update(_: number): void { }
}

describe("Interaction tests", () => {

    test("Can find scene object", () => {

        const scope1 = [
            new FinderGameObject("1"),
            new FinderGameObject("2"),
            new FinderGameObject("3"),
        ];


        const scope2 = [
            new FinderGameObject("4"),
            new FinderGameObject("5"),
            new FinderGameObject("6"),
        ];

        new FinderGameObject("7");

        const s1 = new Scene();
        s1.load(scope1);

        const s2 = new Scene();
        s2.load(scope2);

        expect(scope1[0].find('2')).toBe(scope1[1]);
        expect(scope1[0].find('4')).toBeUndefined();
        expect(scope1[0].find('1')).toBe(scope1[0]);

        expect(scope2[0].find('5')).toBe(scope2[1]);
        expect(scope2[0].find('1')).toBeUndefined();

        expect(scope1[0].find('7')).toBeUndefined();
        expect(scope2[0].find('7')).toBeUndefined();
        expect(scope1[0].find('unknown')).toBeUndefined();
    });

    function wait(ms:number) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    test("Scene init", async () => {

        let inited = false;

        const game = new Game(['q'], screen!);
        const scene = new Scene(() => { inited = true; });

        game.start();
        game.useScene(scene);
        await wait(200);

        game.stop();
        
        expect(inited).toBe(true);
    }, 1000);
});

