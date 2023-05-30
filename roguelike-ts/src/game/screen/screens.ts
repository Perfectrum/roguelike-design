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

type HelloResult = (s: string) => void;
function helloScreen(next: HelloResult) {
    const tb = blessed.textbox({
        width: '100%',
        height: 3,
        top: 3,
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
            $.text({ height: 2, left: 'center' })('Hello! Enter your name:'),
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
        $.box({ width: '100%-30', height: '100%' })(
            $.box({ width: '100%', top: 0, left: 0, height: '100%-5', border: 'line' })(
                $.customCamera()(cam)
            ),
            $.box({ width: '100%', height: 5, padding: 1, bottom: 0, left: 0, border: 'line' })(
                $.text({ id: 'tip' })('Tip: use WASD to walk!')
            )
        ),
        $.box({ right: 0, top: 0, width: 24, height: '100%', padding: 1, border: 'line' })(
            $.text({ tags: true, align: 'right' })(`{bold}NAME{/bold}:\n${player}`),
            ////////////////////////////////////////////////////////////////////////////////////
            $.text({ id: 'xpTitle', top: 3, tags: true, align: 'right' })('{bold}XP{/bold}:'),
            $.text({ id: 'xpBar', top: 4, tags: true, align: 'right' })('[#####----------] 54'),
            ////////////////////////////////////////////////////////////////////////////////////
            $.text({ id: 'hpBar', top: 6, tags: true, align: 'right' })('[#####----------] 54')
            ////////////////////////////////////////////////////////////////////////////////////
        )
    );
}

const gameOverText = fs.readFileSync(
    path.resolve(__dirname, '..', '..', '..', 'resources', 'gameOver.txt'),
    'utf-8'
);

function gameOverScreen() {
    return $.scene()(
        $.box({ width: '100%', height: '100%', top: 0, left: 0, border: 'line' })(
            $.text({ top: 'center', left: 'center' })(gameOverText)
        )
    );
}

export const screens = {
    fullScreen,
    fullScreenWithCustomCamera,
    helloScreen,
    gameOverScreen
};
