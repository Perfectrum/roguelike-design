package roguelike.context.gameworld;

import com.googlecode.lanterna.TerminalSize;
import com.googlecode.lanterna.TextCharacter;
import com.googlecode.lanterna.screen.TerminalScreen;
import com.googlecode.lanterna.terminal.Terminal;
import roguelike.context.Context;
import roguelike.gameobjects.PlayerCharacter;
import roguelike.gameplay.gamelocation.GameLocation;
import roguelike.gameplay.gamelocation.GameLocationFactory;

import java.io.IOException;

public class Gameworld extends Context {
    private GameLocationFactory gameLocationFactory;
    private GameLocation gameLocation;

    private TerminalScreen screen;

    private PlayerCharacter player;

    class Scope {
        private int leftX;
        private int upY;

        private int rightX;
        private int downY;
        private int height;
        private int width;
        public Scope(int newHeight, int newWidth) {
            height = newHeight;
            width = newWidth;
        }

        public void actualizeScope() {
            int radiusX = width / 2;
            int radiusY = height / 2;
            leftX = Math.max(0, player.getxObject() - radiusX);
            upY = Math.max(0, player.getyObject() - radiusY);
            rightX = Math.min(player.getxObject() + radiusX, gameLocation.getWidth());
            downY = Math.min(player.getyObject() + radiusY, gameLocation.getHeight());
        }
    }

    private Scope scope;

    public Gameworld(Terminal newTerminal) throws IOException {
        super(newTerminal);

        int radiusX = 30;
        int radiusY = 30;
        scope = new Scope(radiusX * 2 + 1, radiusY * 2 + 1);
        screen = new TerminalScreen(terminal);
        drawer = new GameworldDrawer();

        int playerX = 5;
        int playerY = 5;
        player = new PlayerCharacter(5, 5, new TextCharacter('@'));

        screen.startScreen();
        screen.setCursorPosition(null);

        gameLocationFactory = new GameLocationFactory();
        gameLocation = gameLocationFactory.createRectangularLocation(300, 300);
    }

    public class GameworldDrawer {
        public GameworldDrawer () {}
        private void drawPlayer() {
            screen.setCharacter(player.getxObject() - scope.leftX,
                    player.getyObject() - scope.upY, new TextCharacter('@'));
        }

        private void drawScopeLocation() {
            for (int y = 0; y < scope.height; ++y) {
                for (int x = 0; x < scope.width; ++x) {
                    screen.setCharacter(x, y, new TextCharacter(
                            gameLocation.getCharAt(scope.leftX + x, scope.upY + y)));
                }
            }
        }

        public void drawWorld() throws IOException {
            terminal.clearScreen();
            screen.clear();
            scope.actualizeScope();

            drawScopeLocation();
            drawPlayer();
            screen.refresh();
            terminal.flush();
            Thread.yield();
        }
    }

    GameworldDrawer drawer;

    public void drawWorld() throws IOException {
        drawer.drawWorld();
    }

    private boolean isStepable(int x, int y) {
        return 0 <= x && x < gameLocation.getWidth() &&
                0 <= y && y < gameLocation.getHeight() && gameLocation.getCharAt(x, y) != 'X';
    }
    private void playerLeftStep() {
        player.setX(player.getxObject() - 1);
    }
    private void playerRightStep() {
        player.setX(player.getxObject() + 1);
    }
    private void playerUpStep() {
        player.setY(player.getyObject() - 1);
    }
    private void playerDownStep() {
        player.setY(player.getyObject() + 1);
    }

    @Override
    public ReturnResult run() throws InterruptedException, IOException {
        Thread.yield();
        drawWorld();
        while (true) {
            var keyStroke = getKey();
            if (keyStroke == null) {
                continue;
            }
            switch (keyStroke.getCharacter()) {
                case 'm', 'M' -> {
                    return new ReturnResult(ReturnResult.EnumResult.ReturnToMainMenu);
                }
                case 'w', 'W' -> {
                    if (isStepable(player.getxObject(), player.getyObject() - 1)) {
                        playerUpStep();
                    }
                }
                case 's', 'S' -> {
                    if (isStepable(player.getxObject(), player.getyObject() + 1)) {
                        playerDownStep();
                    }
                }
                case 'a', 'A' -> {
                    if (isStepable(player.getxObject() - 1, player.getyObject())) {
                        playerLeftStep();
                    }
                }
                case 'd', 'D' -> {
                    if (isStepable(player.getxObject() + 1, player.getyObject())) {
                        playerRightStep();
                    }
                }
            }
            drawWorld();
        }
    }
}
