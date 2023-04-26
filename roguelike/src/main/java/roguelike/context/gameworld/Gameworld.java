package roguelike.context.gameworld;

import com.googlecode.lanterna.screen.TerminalScreen;
import com.googlecode.lanterna.terminal.Terminal;
import roguelike.context.Context;
import roguelike.gameobjects.GameObjectFactory;
import roguelike.gameobjects.PlayerCharacter;
import roguelike.gameplay.gamelocation.GameLocation;
import roguelike.gameplay.gamelocation.GameLocationFactory;

import java.io.IOException;

public class Gameworld extends Context {
    private final GameObjectFactory gameObjectFactory;
    private final GameLocationFactory gameLocationFactory;

    public GameLocationFactory getGameLocationFactory() {
        return gameLocationFactory;
    }
    private GameLocation gameLocation;

    public GameLocation getGameLocation() {
        return gameLocation;
    }
    public void setGameLocation(GameLocation gameLocation) {
        this.gameLocation = gameLocation;
    }

    private final TerminalScreen screen;

    private final PlayerCharacter player;

    public PlayerCharacter getPlayer() {
        return player;
    }

    public void setPlayerXY(int x, int y) {
        player.setX(x);
        player.setY(y);
    }

    class Scope {
        private int leftX;
        private int upY;
        private int rightX;
        private int downY;
        private final int radiusY;
        private final int radiusX;
        public Scope(int radiusX, int radiusY) {
            this.radiusX = radiusX;
            this.radiusY = radiusY;
        }

        private int clam(int a, int b, int c) {
            return Math.min(Math.max(a, b), c);
        }

        public void actualizeScope() {
            var curRadiusX = Math.min(radiusX, (gameLocation.getWidth()- 1) / 2);
            var curRadiusY = Math.min(radiusY, (gameLocation.getHeight() - 1) / 2);
            leftX = clam(0, player.getX() -  curRadiusX,
                    gameLocation.getWidth() - 2 *  curRadiusX - 1);
            rightX = clam(player.getX() +  curRadiusX, 2 *  curRadiusX,
                    gameLocation.getWidth() - 1);
            upY = clam(0, player.getY() - curRadiusY,
                    gameLocation.getHeight() - 2 * curRadiusY - 1);
            downY = clam(player.getY() + curRadiusY, 2 * curRadiusY,
                    gameLocation.getHeight() - 1);
        }
    }

    private final Scope scope;

    private final int scopeRadiusX = 7;
    private final int scopeRadiusY = 7;

    public int getScopeRadiusX() {
        return scopeRadiusX;
    }
    public int getScopeRadiusY() {
        return scopeRadiusY;
    }

    public class GameworldDrawer {
        public GameworldDrawer () {}

        private void drawScopeLocation() {
            for (int x = scope.leftX; x <= scope.rightX; ++x){
                {for (int y = scope.upY; y <= scope.downY; ++y)
                    screen.setCharacter(
                            x - scope.leftX, y - scope.upY,
                                    gameLocation.getTextCharAt(x, y));
                }
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
        private void drawPlayer() {
            screen.setCharacter(player.getX() - scope.leftX,
                    player.getY() - scope.upY, player.getSymb());
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

    public Gameworld(Terminal newTerminal) throws IOException {
        super(newTerminal);

        scope = new Scope(scopeRadiusX, scopeRadiusY);
        screen = new TerminalScreen(terminal);
        screen.startScreen();
        screen.setCursorPosition(null);

        drawer = new GameworldDrawer();

        gameObjectFactory = new GameObjectFactory();

        gameLocationFactory = new GameLocationFactory(gameObjectFactory);
        gameLocation = gameLocationFactory.
                createRandomLinesGameLocation(3 * scopeRadiusX, 4 * scopeRadiusY);
        player = gameObjectFactory.createPlayerCharacter(0, 0);
        gameLocation.setPlayerFreeCell(player);
    }
    public void drawWorld() throws IOException {
        scope.actualizeScope();
        drawer.drawWorld();
    }

    private boolean isStepable(int x, int y) {
        return 0 <= x && x < gameLocation.getWidth() &&
                0 <= y && y < gameLocation.getHeight() &&
                gameLocation.getTextCharAt(x, y).getCharacter() != 'X';
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
                            /* важный брейк, взаимодействие только с
                             * 1 обжектом делаем это первый аргумент,
                             * второй - лут удаляется себя и итерация
                             * форич ломается  */
                            break;
                        }
                    }
                }
            }
            drawWorld();
        }
    }
}
