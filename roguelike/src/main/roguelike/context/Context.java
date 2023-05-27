package roguelike.context;

import com.googlecode.lanterna.terminal.Terminal;

import java.io.IOException;

/** Контекст текущей игры, читает ввод игрока
 *  который интерпретирует в своей предметной области. */
public class Context {
    protected Terminal terminal;

    public Context(Terminal newTerminal) {
        terminal = newTerminal;
    }

    /** Читает введенный символ. */
    public Character getKey() throws IOException {
        return terminal.readInput().getCharacter();
    }
    public static class ReturnResult {
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
    /** Запускает работу контекста. */
    public ReturnResult run() throws InterruptedException, IOException {
        return null;
    }
}
