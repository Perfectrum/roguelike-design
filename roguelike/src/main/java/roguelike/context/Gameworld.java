package roguelike.context;

import com.googlecode.lanterna.TerminalSize;
import com.googlecode.lanterna.TextCharacter;
import com.googlecode.lanterna.TextColor;
import com.googlecode.lanterna.screen.TerminalScreen;
import com.googlecode.lanterna.terminal.Terminal;
import roguelike.gameplay.gamelocation.GameLocation;
import roguelike.gameplay.gamelocation.GameLocationFactory;

import java.io.IOException;

public class Gameworld extends Context {
    private GameLocationFactory gameLocationFactory;
    private GameLocation gameLocation;

    private TerminalScreen screen;

    private int player_x = 0;
    private int player_y = 0;

    private int scope = 20;

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
        var yLim = Math.min(Math.min(player_y + scope,terminalSize.getRows()), gameLocation.getHeight());
        var xLim = Math.min(Math.min(player_x + scope,terminalSize.getColumns()), gameLocation.getWidth());

        for (int y = Math.max(0, player_y - scope); y < yLim; ++y) {
            for (int x = Math.max(0, player_x - scope); x < xLim; ++x) {
                screen.setCharacter(x, y, new TextCharacter(gameLocation.getCharAt(x, y)));
            }
        }
    }

    private void drawPlayer() {
        screen.setCharacter(player_x, player_y, new TextCharacter('@'));
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
            }
        }
    }
}
