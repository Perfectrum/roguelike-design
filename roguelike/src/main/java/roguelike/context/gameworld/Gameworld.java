package roguelike.context.gameworld;

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
        private int radiusY;
        private int radiusX;
        public Scope(int radiusX, int radiusY) {
            this.radiusX = radiusX;
            this.radiusY = radiusY;
        }

        private int clam(int a, int b, int c) {
            return Math.min(Math.max(a, b), c);
        }

        public void actualizeScope() {
            leftX = clam(0, player.getX() - radiusX,
                    gameLocation.getWidth() - 2 * radiusX - 1);
            rightX = clam(player.getX() + radiusX, 2 * radiusX,
                    gameLocation.getWidth() - 1);
            upY = clam(0, player.getY() - radiusY,
                    gameLocation.getHeight() - 2 * radiusY - 1);
            downY = clam(player.getY() + radiusY, 2 * radiusY,
                    gameLocation.getHeight() - 1);
        }
    }

    private Scope scope;

    private int scopeRadiusX = 10;
    private int scopeRadiusY = 10;

    public int getScopeRadiusX() {
        return scopeRadiusX;
    }
    public int getScopeRadiusY() {
        return scopeRadiusY;
    }

    public void changeLocation(GameLocation gameLocation) {
        this.gameLocation = gameLocation;
    }

    public void setPlayerXY(int x, int y) {
        player.setX(x);
        player.setY(y);
    }

    public Gameworld(Terminal newTerminal) throws IOException {
        super(newTerminal);


        scope = new Scope(scopeRadiusX, scopeRadiusY);
        screen = new TerminalScreen(terminal);
        drawer = new GameworldDrawer();

        int playerX = 1;
        int playerY = 1;
        player = new PlayerCharacter(1, 1, new TextCharacter('@'));

        screen.startScreen();
        screen.setCursorPosition(null);

        gameLocationFactory = new GameLocationFactory();
        gameLocation = gameLocationFactory.createRectangularLocationWithEntrance
                (scopeRadiusX * 3, scopeRadiusY * 3);
    }

    public class GameworldDrawer {
        public GameworldDrawer () {}
        private void drawPlayer() {
            screen.setCharacter(player.getX() - scope.leftX,
                    player.getY() - scope.upY, player.getSymb());
        }

        private void drawScopeLocation() {
            for (int y = scope.upY; y <= scope.downY; ++y) {
                for (int x = scope.leftX; x <= scope.rightX; ++x) {
                    screen.setCharacter(
                            x - scope.leftX, y - scope.upY,
                            new TextCharacter(
                            gameLocation.getCharAt(x, y)));
                }
            }
            if (gameLocation.getGameObjects() == null) {
                return;
            }
            for (var gameObj: gameLocation.getGameObjects()) {
                var x = gameObj.getX();
                var y = gameObj.getY();
                if (scope.leftX <= x && x <= scope.rightX &&
                    scope.upY <= y && y <= scope.downY) {
                    screen.setCharacter(x - scope.leftX,
                            y - scope.upY, gameObj.getSymb());
                }
            }
        }

        public void drawWorld() throws IOException {
            terminal.clearScreen();
            screen.clear();

            drawScopeLocation();
            drawPlayer();
            screen.refresh();
            terminal.flush();
            Thread.yield();
        }
    }

    GameworldDrawer drawer;

    public void drawWorld() throws IOException {
        scope.actualizeScope();
        drawer.drawWorld();
    }

    private boolean isStepable(int x, int y) {
        return 0 <= x && x < gameLocation.getWidth() &&
                0 <= y && y < gameLocation.getHeight() && gameLocation.getCharAt(x, y) != 'X';
    }
    private void playerLeftStep() {
        player.setX(player.getX() - 1);
    }
    private void playerRightStep() {
        player.setX(player.getX() + 1);
    }
    private void playerUpStep() {
        player.setY(player.getY() - 1);
    }
    private void playerDownStep() {
        player.setY(player.getY() + 1);
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
                    if (isStepable(player.getX(), player.getY() - 1)) {
                        playerUpStep();
                    }
                }
                case 's', 'S' -> {
                    if (isStepable(player.getX(), player.getY() + 1)) {
                        playerDownStep();
                    }
                }
                case 'a', 'A' -> {
                    if (isStepable(player.getX() - 1, player.getY())) {
                        playerLeftStep();
                    }
                }
                case 'd', 'D' -> {
                    if (isStepable(player.getX() + 1, player.getY())) {
                        playerRightStep();
                    }
                }
                case 'e', 'E' -> {
                    for (var gameObject: gameLocation.getGameObjects()) {
                        if (gameObject.getX() == player.getX() &&
                                gameObject.getY() == player.getY()) {
                            gameObject.interact(this);
                            System.out.println("interact called");
                        }
                    }
                }
            }
            drawWorld();
        }
    }

    public GameLocationFactory getGameLocationFactory() {
        return gameLocationFactory;
    }
}
