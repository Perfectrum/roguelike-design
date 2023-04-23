package roguelike.context;

import com.googlecode.lanterna.TerminalSize;
import com.googlecode.lanterna.TextCharacter;
import com.googlecode.lanterna.screen.TerminalScreen;
import com.googlecode.lanterna.terminal.Terminal;
import roguelike.gameplay.gamelocation.GameLocation;
import roguelike.gameplay.gamelocation.GameLocationFactory;

import java.io.IOException;

public class Gameworld extends Context {
    private GameLocationFactory gameLocationFactory;
    private GameLocation gameLocation;

    private TerminalScreen screen;

    private int playerX = 1;
    private int playerY = 1;

    private int scopeX = 20;
    private int scopeY = 20;

    public Gameworld(Terminal newTerminal) throws IOException {
        super(newTerminal);
        screen = new TerminalScreen(terminal);
        screen.startScreen();
        screen.setCursorPosition(null);

        gameLocationFactory = new GameLocationFactory();
        gameLocation = gameLocationFactory.createRectangularLocation(300, 300);
    }

    private void drawScopeLocation() {
        TerminalSize terminalSize = screen.getTerminalSize();
        var yLim = Math.min(Math.min(playerY + scopeY,terminalSize.getRows()), gameLocation.getHeight());
        var xLim = Math.min(Math.min(playerX + scopeX,terminalSize.getColumns()), gameLocation.getWidth());

        screen.clear();
        for (int y = Math.max(0, playerY - scopeY); y < yLim; ++y) {
            for (int x = Math.max(0, playerX - scopeX); x < xLim; ++x) {
                screen.setCharacter(x, y, new TextCharacter(gameLocation.getCharAt(x, y)));
            }
        }
    }

    private void drawPlayer() {
        screen.setCharacter(playerX, playerY, new TextCharacter('@'));
    }

    private boolean isStepable(int x, int y) {
        return 0 <= x && x < gameLocation.getWidth() &&
                0 <= y && y < gameLocation.getHeight() && gameLocation.getCharAt(x, y) != 'X';
    }
    private void playerLeftStep() {
        playerX -= 1;
    }
    private void playerRightStep() {
        playerX += 1;
    }
    private void playerUpStep() {
        playerY -= 1;
    }
    private void playerDownStep() {
        playerY += 1;
    }


    private void showWorld() throws IOException {
        terminal.clearScreen();
        drawScopeLocation();
        drawPlayer();
        screen.refresh();
        terminal.flush();
    }

    @Override
    public ReturnResult run() throws InterruptedException, IOException {
        Thread.yield();
        showWorld();
        while (true) {
            var keyStroke = getKey();
            if (keyStroke == null) {
                continue;
            }
            switch (keyStroke.getCharacter()) {
                case 'm' -> {
                    return new ReturnResult(ReturnResult.EnumResult.ReturnToMainMenu);
                }
                case 'M' -> {
                    return new ReturnResult(ReturnResult.EnumResult.ReturnToMainMenu);
                }
                case 'W' -> {
                    if (isStepable(playerX, playerY - 1)) {
                        playerUpStep();
                    }
                }
                case 'w' -> {
                    if (isStepable(playerX, playerY - 1)) {
                        playerUpStep();
                    }
                }
                case 'S' -> {
                    if (isStepable(playerX, playerY + 1)) {
                        playerDownStep();
                    }
                }
                case 's' -> {
                    if (isStepable(playerX, playerY + 1)) {
                        playerDownStep();
                    }
                }
                case 'a' -> {
                    if (isStepable(playerX - 1, playerY)) {
                        playerLeftStep();
                    }
                }
                case 'A' -> {
                    if (isStepable(playerX - 1, playerY)) {
                        playerLeftStep();
                    }
                }
                case 'd' -> {
                    if (isStepable(playerX + 1, playerY)) {
                        playerRightStep();
                    }
                }
                case 'D' -> {
                    if (isStepable(playerX + 1, playerY)) {
                        playerRightStep();
                    }
                }
            }
            showWorld();
        }
    }
}
