import { GameObject } from "./engine/elements/gameobject";
import { Game } from "./engine/game";
import { MovableCamera } from "./game/cameras/movablecam";
import { ObjectLinkedCamera } from "./game/cameras/stickycam";
import { generateMap } from "./game/map/generator";
import { maps } from "./game/map/maps";
import { screens } from "./game/screen/screens";

function main() {
    const game = new Game([
        'escape',
        'C-c',
        'q'
    ]);

    /*
    const objs = maps.testMap();
    const hero = objs.shift()!;
    objs.push(hero);


    const hello = screens.helloScreen((player) => {
        
        // new ObjectLinkedCamera(hero)
        const test = screens.fullScreenWithCustomCamera(new MovableCamera(), player);
        test.load(objs);

        game.appendScene(test);
    });
    */

    let hero : GameObject | null = null;
    let player:string = "";
    const loadScene = () => {
        const [ h, objs] = generateMap(50, 50, 10, 30);
        if (!h) {
            return;
        }
        if (!hero) {
            hero = h;
        }
        objs.push(hero);
        const gameLevel = screens.fullScreenWithCustomCamera(
            new ObjectLinkedCamera(hero, [], { tags : true }), 
            player,
            () => {
                if (hero) {
                    hero.mockOther(h);
                }
            },
            (msg) => {
                if (msg === 'nextLvl') {
                    return loadScene();
                }
                if (msg === 'gameOver') {
                    return game.changeScene(screens.gameOverScreen());
                }
            }
        );

        gameLevel.load(objs);
        game.changeScene(gameLevel);
    }

    // loadScene();

    const hello = screens.helloScreen((pl) => {
        player = pl;
        loadScene();
    });


    game.changeScene(hello);    
    game.start();
}

main();
