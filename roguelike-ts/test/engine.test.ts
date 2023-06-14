import blessed, { Widgets } from 'blessed';
import { Game } from '../src/engine/game';

describe("General engine tests", () => {

    let screen: Widgets.Screen | null = null;

    beforeEach(() => {
        screen = blessed.screen();
    });

    afterEach(() => {
        screen?.destroy();
    });

    test("Can init Game", () => {
        
        const g = new Game([ 'q' ], screen!);

        expect(() => {
            g.start();
            g.stop();
        }).not.toThrow();
    });
});

describe("Scene tests", () => {

});

describe("GameObject tests", () => {

});
