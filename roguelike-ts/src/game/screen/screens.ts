import path from 'path';
import { Camera } from '../../engine/elements/camera';
import { $ } from '../../engine/utils/uitoolkit';
import blessed from 'blessed';

import fs from 'fs';

function fullScreen() {
    return $.scene()(
        $.box({ width: '100%', height: '100%' })($.camera({ width: '100%', height: '100%' })())
    );
}

const helloText = fs.readFileSync(
    path.resolve(__dirname, '..', '..', '..', 'resources', 'helloText.txt'),
    'utf-8'
);

type HelloResult = (s: string) => void;
function helloScreen(next: HelloResult) {
    const tb = blessed.textbox({
        width: 30,
        height: 3,
        top: 15,
        left: 'center',
        border: 'line'
    });

    return $.scene({
        init: () => {
            tb.readInput((err, value) => {
                if (!err && value) next(value);
            });
        }
    })(
        $.box({ width: '50%', height: '50%', top: 'center', left: 'center' })(
            $.text({ left: 'center', width: 55 })(helloText),
            $.text({ top: 14, height: 2, left: 'center' })('Hello! Enter your name:'),
            $.use()(tb)
        )
    );
}

function fullScreenWithCustomCamera(
    cam: Camera,
    player: string,
    started: () => void,
    result: (msg: string) => void
) {
    return $.scene({
        init: started,
        event: (msg) => {
            result(msg);
        }
    })(
        $.box({ width: '100%-28', height: '100%' })(
            $.box({ width: '100%', top: 0, left: 0, height: '100%-5', border: 'line' })(
                $.customCamera()(cam)
            ),
            $.box({ width: '100%', height: 5, padding: 1, bottom: 0, left: 0, border: 'line' })(
                $.text({ id: 'tip', tags: true })('Tip: use WASD to walk!')
            )
        ),
        $.box({ right: 0, top: 0, width: 28, height: '100%', padding: 1, border: 'line' })(
            $.text({ tags: true, align: 'right' })(`{bold}NAME{/bold}:\n${player}`),
            ////////////////////////////////////////////////////////////////////////////////////
            $.text({ id: 'xpTitle', top: 3, tags: true, align: 'right' })('{bold}XP{/bold}:'),
            $.text({ id: 'xpBar', top: 4, tags: true, align: 'right' })('[#####----------] 54'),
            ////////////////////////////////////////////////////////////////////////////////////
            $.text({ id: 'hpBar', top: 6, tags: true, align: 'right' })('[#####----------] 54'),
            ////////////////////////////////////////////////////////////////////////////////////
            $.text({ id: 'dmgTitle', top: 7, tags: true, align: 'right' })('DMG 4 (+3)'),
            $.text({ id: 'armTitle', top: 8, tags: true, align: 'right' })('ARM 2 (+5)'),
            ////////////////////////////////////////////////////////////////////////////////////
            $.text({ top: 10, tags: true })('{bold}Inventory{/bold}'),
            $.text({ id: 'fireballsDisplay', top: 12, tags: true })('fireballs: '),
            $.text({ id: 'inventoryDisplay', top: 14, tags: true })('')
        )
    );
}

const gameOverText = fs.readFileSync(
    path.resolve(__dirname, '..', '..', '..', 'resources', 'gameOver.txt'),
    'utf-8'
);

function gameOverScreen(player: string) {
    return $.scene()(
        $.box({ width: '100%', height: '100%', top: 0, left: 0, border: 'line' })(
            $.box({ width: 55, height: 17, top: 'center', left: 'center' })(
                $.text({ left: 'center', width: 55 })(gameOverText),
                $.text({
                    id: 'mobsLabel',
                    top: 8,
                    width: 50,
                    height: 1,
                    left: 'center',
                    tags: true
                })(`{bold}${player}{/bold}`),
                $.text({
                    id: 'mobsLabel',
                    top: 10,
                    width: 50,
                    height: 1,
                    left: 'center',
                    tags: true
                })('wefew efwef'),
                $.text({
                    id: 'levelsLabel',
                    top: 11,
                    width: 50,
                    height: 1,
                    align: 'center',
                    left: 'center',
                    tags: true
                })('wefew efwef'),
                $.text({
                    id: 'scoreLabel',
                    top: 12,
                    width: 50,
                    height: 1,
                    align: 'right',
                    left: 'center',
                    tags: true
                })('wefew efwef'),
                $.text({ width: 50, top: 14, left: 'center', tags: true })(
                    'You can press "y" to record this score to global rating table! Press "escape" to exit game!'
                )
            )
        )
    );
}

export const screens = {
    fullScreen,
    fullScreenWithCustomCamera,
    helloScreen,
    gameOverScreen
};
