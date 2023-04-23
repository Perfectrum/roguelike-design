package roguelike.context;

import com.googlecode.lanterna.input.KeyStroke;
import com.googlecode.lanterna.terminal.Terminal;

import java.io.IOException;

public class Context {
    protected Terminal terminal;

    public Context(Terminal newTerminal) {
        terminal = newTerminal;
    }
    public KeyStroke getKey() throws IOException {
        return terminal.pollInput();
    }
    public class ReturnResult {
        public enum EnumResult {
            StartNewGame,
            ContinueGame,
            ReturnToMainMenu,
        }
        private final EnumResult enumRes;
        public ReturnResult(EnumResult newEnumRes) {
            enumRes = newEnumRes;
        }

        public EnumResult getEnumRes() {
            return enumRes;
        }
    }

    public ReturnResult run() throws InterruptedException, IOException {
        return null;
    }
}
