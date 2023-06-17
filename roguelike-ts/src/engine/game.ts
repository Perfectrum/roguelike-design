import blessed from 'blessed';
import { RenderFunc, createRender } from './components/graphics';
import { PhysicsFunc, createPhysics } from './components/physics';
import { Scene } from './elements/scene';

/**
 * Класс игры
 */
export class Game {
    private screen;
    private gameLoop: null | NodeJS.Timer;

    private time = 0;
    private ticks = 0;

    private render: RenderFunc;
    private calc: PhysicsFunc;

    private currentScene: Scene;

    private scheduledBuisness: (() => void)[];

    /**
     * Создает новую игру
     * @constructor
     * @param {string[]} stopSymbols - Комбинация клавиш для выхода из игры
     * @param {string} title - Заголовок окна
     */
    constructor(stopSymbols: string[], title = 'Rougelike') {
        this.screen = blessed.screen({
            smartCSR: true
        });
        this.screen.title = title;

        this.screen.key(stopSymbols, () => {
            return process.exit(0);
        });

        this.render = createRender(this.screen);
        this.calc = createPhysics(this.screen);

        this.gameLoop = null;

        this.time = 0;
        this.ticks = 0;

        this.currentScene = new Scene();

        this.screen.append(this.currentScene.getBox());
        this.scheduledBuisness = [];

        this.controllEvents();
    }

    /**
     * Устанавливает обработчик нажатия клавиш
     * @private
     */
    private controllEvents() {
        this.screen.on('keypress', (_, key) => {
            for (const obj of this.currentScene.getObjects()) {
                obj.keyPressed(key);
            }
        });
    }

    /**
     * Выполняет запланированные задачи из очереди scheduledBuisness
     * @private
     */
    private doGLobalWork() {
        while (this.scheduledBuisness.length) {
            const job = this.scheduledBuisness.shift();
            if (job) {
                job();
            }
        }
    }

    /**
     * Реализует игровую логику
     * @private
     * @param {number} dt - Время, прошедшее с последнего обновления
     */
    private run(dt: number) {
        this.calc(this.currentScene, dt, this.ticks);
        this.render(this.currentScene);
        this.doGLobalWork();
    }

    /**
     * Добавляет обновление сцены в очередь задач
     * @private
     * @param {Scene} scene - Новая сцена игры.
     */
    useScene(scene: Scene) {
        const job = () => {
            this.screen.remove(this.currentScene.getBox());
            this.currentScene = scene;
            this.screen.append(scene.getBox());

            this.currentScene.init();
        };

        if (this.gameLoop === null) {
            return job();
        }

        this.scheduledBuisness.push(job);
    }

    /**
     * Запускает игру
     */
    start() {
        if (this.gameLoop === null) {
            this.time = performance.now();
            this.ticks = 0;
            this.gameLoop = setInterval(() => {
                const now = performance.now();
                this.run(now - this.time);
                this.time = now;
                ++this.ticks;
            }, 100);
        }
    }

    /**
     * Останавливает игру
     */
    stop() {
        if (this.gameLoop !== null) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
    }

    changeScene(scene: Scene) {
        this.useScene(scene);
    }

    getCurrentScene() {
        return this.currentScene;
    }

    createScene() {
        return new Scene();
    }
}
