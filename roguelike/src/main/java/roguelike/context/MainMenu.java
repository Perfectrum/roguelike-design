package roguelike.context;

import com.googlecode.lanterna.input.KeyStroke;
import com.googlecode.lanterna.input.KeyType;
import com.googlecode.lanterna.terminal.Terminal;

import java.io.IOException;

public class MainMenu extends Context {
    public MainMenu(Terminal newTerminal) {
        super(newTerminal);
    }

    private void introduceMenu() throws IOException {
        terminal.clearScreen();
        terminal.putString("1. Start new Game (last game will be deleted)");
        terminal.putCharacter('\n');
        terminal.putString("2. Continue Game");
        terminal.putCharacter('\n');
        terminal.putString("Press 1 or 2");
        terminal.putCharacter('\n');
        terminal.flush();

    }

    @Override
    public ReturnResult run() throws InterruptedException, IOException {
        Thread.yield();
        introduceMenu();

        while (true) {
            var keyStroke = getKey();
            if (keyStroke == null) {
                continue;
            }
            switch (keyStroke) {
                case '1':
                    return new ReturnResult(ReturnResult.EnumResult.StartNewGame);
                case '2':
                    return new ReturnResult(ReturnResult.EnumResult.ContinueGame);
            }
        }
    }
}
