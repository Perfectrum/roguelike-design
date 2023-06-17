import { GameObject } from './engine/elements/gameobject';
import { Game } from './engine/game';
import { ObjectLinkedCamera } from './game/cameras/stickycam';
import { generateMap } from './game/map/generator';
import { screens } from './game/screen/screens';
import blessed from 'blessed'


/**
 * Точка входа в программу
 * Она создает экземпляр игры, загружает сцены и запускает игру
 */
function main() {
    const game = new Game(['escape', 'C-c'], blessed.screen({ smartCSR: true, debug: true }));

    let hero: GameObject | null = null;
    let player = '';

    /**
     * Загрузка сцены игры.
     * Функция генерирует карту, добавляет на нее героя, создает уровень игры и меняет текущую сцену игры на загруженный уровень
     */
    const loadScene = () => {
        const [h, objs] = generateMap(50, 50, 50, 10);
        if (!h) {
            return;
        }
        if (!hero) {
            hero = h;
        }
        objs.push(hero);
        const gameLevel = screens.fullScreenWithCustomCamera(
            new ObjectLinkedCamera(hero, [], { tags: true }),
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
                    const finalScene = screens.gameOverScreen(player);
                    if (hero) {
                        finalScene.add(hero);
                    }
                    return game.changeScene(finalScene);
                }
            }
        );

        gameLevel.load(objs);
        game.changeScene(gameLevel);
    };

    const hello = screens.helloScreen((pl) => {
        player = pl;
        loadScene();
    });

    game.changeScene(hello);
    // game.changeScene(screens.gameOverScreen(player))
    game.start();
}

main();
