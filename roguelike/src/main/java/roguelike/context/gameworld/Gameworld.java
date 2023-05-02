package roguelike.context.gameworld;

import com.googlecode.lanterna.TextCharacter;
import com.googlecode.lanterna.screen.TerminalScreen;
import com.googlecode.lanterna.terminal.Terminal;
import roguelike.context.Context;
import roguelike.gameobjects.GameObjectFactory;
import roguelike.gameobjects.PlayerCharacter;
import roguelike.gameobjects.items.EquipableItem;
import roguelike.gameplay.gamelocation.GameLocation;
import roguelike.gameplay.gamelocation.GameLocationFactory;

import java.io.IOException;

/**
 * Хранит состояние текущей игры:
 *
 * * Персонажа
 * * Локацию и объекты на ней
 * * Статус меню инвентаря
 * Интерпретирует действия игрока
 * */
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


        /**
         * Хранит границы части карты которую нужно отрисовать*/
    public class Scope {
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


        /** Актуализирует скоуп под текущую игровую ситуацию */
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

    /**
     * Рисует игровой мир методом drawWorld(), вызывается после действия игрока.
     *
     * Рисует меню инвентаря если он был вызван.
     *
     * Берет информацию о карте и рисует её.*/
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

        private void drawInventoryMenu() throws IOException {
            var terminalSize = terminal.getTerminalSize();
            int menuWidth = 25;
            // int menuHeight = 20;
            int inventoryUpRow = 0;
            int inventoryLeftColumn = terminalSize.getColumns() - menuWidth;
            var curRow = inventoryUpRow;
            var curColumn = inventoryLeftColumn;

            for (int k = firstItem; k < player.getInventory().getItems().size(); ++k) {
                var item = player.getInventory().getItems().get(k);
                var name = item.getName();
                screen.setCharacter(curColumn++, curRow,
                        new TextCharacter((char)('0' + (k - firstItem))));
                curColumn++;
                for (int i = 0; i < name.length(); ++i) {
                    screen.setCharacter(curColumn++, curRow, new TextCharacter(name.charAt(i)));
                }
                if (EquipableItem.class.isInstance(item)) {
                    var eqItem = (EquipableItem)item;
                    if (eqItem.itemIsEquiped()) {
                        screen.setCharacter(terminalSize.getColumns() - 3,
                                curRow, new TextCharacter('e'));
                    }
                }
                curColumn = inventoryLeftColumn;
                ++curRow;
            }
        }

        /** Рисует игровой мир,
         * рисует меню инвентаря если оно вызвано */
        public void drawWorld() throws IOException {
            terminal.clearScreen();
            screen.clear();

            drawScopeLocation();
            drawPlayer();
            if (inInventoryMenu) {
                drawInventoryMenu();
            }
            screen.refresh();
            terminal.flush();
            Thread.yield();
        }
    }
    GameworldDrawer drawer;

    public Gameworld(Terminal newTerminal) throws IOException {
        super(newTerminal);
        gameObjectFactory = new GameObjectFactory();

        gameLocationFactory = new GameLocationFactory(gameObjectFactory);
        gameLocation = gameLocationFactory.
                createRandomLinesGameLocation(5 * scopeRadiusX, 6 * scopeRadiusY);
        player = gameObjectFactory.createPlayerCharacter(0, 0);
        gameLocation.setPlayerFreeCell(player);
        inventoryMenu = new InventoryMenu(player.getInventory());

        scope = new Scope(scopeRadiusX, scopeRadiusY);
        screen = new TerminalScreen(terminal);
        screen.startScreen();
        screen.setCursorPosition(null);

        drawer = new GameworldDrawer();
    }

    /** Актуализирует скоуп и диктует нарисовать игровой мир */
    public void drawWorld() throws IOException {
        scope.actualizeScope();
        drawer.drawWorld();
    }

    private boolean isStepable(int x, int y) {
        return 0 <= x && x < gameLocation.getWidth() &&
                0 <= y && y < gameLocation.getHeight() &&
                gameLocation.getTextCharAt(x, y).getCharacter() != 'X';
    }


    private boolean inInventoryMenu = false;
    private int firstItem = 0;

    /**
     * Меню инвентаря, отвечает за взаимодействие игрока с инвентарём,
     * переключается когда игрок нажимает i.  В нём игрок может экипировать
     * выбранный по номеру предмет. */
    public class InventoryMenu {
        private PlayerCharacter.Inventory inventory;
        public InventoryMenu(PlayerCharacter.Inventory inventory) {
            this.inventory = inventory;
        }

        /** Запускает работу с меню инвентаря */
        public void runInventory() throws IOException {
            firstItem = 0;
            drawWorld();

            while (true) {
                var keyStroke = getKey();
                int scrollSize = 10;
                if (keyStroke == null) {
                    continue;
                }
                switch (keyStroke) {
                    case 'i', 'I' -> {
                        inInventoryMenu = false;
                        return;
                    }
                    case 'p', 'P' -> {
                        firstItem = Math.max(0, firstItem - scrollSize);
                    }
                    case 'n', 'N' -> {
                        firstItem = firstItem + scrollSize;
                    }
                }
                if (Character.isDigit(keyStroke)) {
                    int ind = firstItem + (keyStroke - '0');
                    if (ind < inventory.getItems().size()) {
                        inventory.getItem(ind).useByPlayer(player);
                    }
                }
                drawWorld();
            }
        }
    }

    private final InventoryMenu inventoryMenu;

    private void runInventory() throws IOException {
        inventoryMenu.runInventory();
    }

    /**
     * Запускает работу gameworld как контекста, читает ввода игрока
     * и интерпретирует его действия для окружающего мира */
    @Override
    public ReturnResult run() throws InterruptedException, IOException {
        Thread.yield();
        drawWorld();
        while (true) {
            var keyStroke = getKey();
            if (keyStroke == null) {
                continue;
            }
            switch (keyStroke) {
                case 'm', 'M' -> {
                    return new ReturnResult(ReturnResult.EnumResult.ReturnToMainMenu);
                }
                case 'w', 'W' -> {
                    if (isStepable(player.getX(), player.getY() - 1)) {
                        player.upStep();
                    }
                }
                case 's', 'S' -> {
                    if (isStepable(player.getX(), player.getY() + 1)) {
                        player.downStep();
                    }
                }
                case 'a', 'A' -> {
                    if (isStepable(player.getX() - 1, player.getY())) {
                        player.leftStep();
                    }
                }
                case 'd', 'D' -> {
                    if (isStepable(player.getX() + 1, player.getY())) {
                        player.rightStep();
                    }
                }
                case 'e', 'E' -> {
                    for (var gameObject: gameLocation.getGameObjects()) {
                        if (gameObject.getX() == player.getX() &&
                                gameObject.getY() == player.getY()) {
                            gameObject.interact(this);
                            System.out.println("interact");
                            /* важный брейк, взаимодействие только с
                             * 1 обжектом делаем это первый аргумент,
                             * второй - лут удаляется себя и итерация
                             * форич ломается  */
                            break;
                        }
                    }
                }
                case 'i', 'I' -> {
                    inInventoryMenu = true;
                    runInventory();
                }

                case 'q', 'Q' -> {
                    return null;
                }
            }
            drawWorld();
        }
    }
}
