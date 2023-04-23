package roguelike.appmanager;

import com.googlecode.lanterna.terminal.DefaultTerminalFactory;
import com.googlecode.lanterna.terminal.Terminal;
import roguelike.context.Context;
import roguelike.context.Gameworld;
import roguelike.context.MainMenu;

import java.io.IOException;

public class AppManager {
    public static void main(String[] args) throws InterruptedException, IOException {
        DefaultTerminalFactory defaultTerminalFactory = new DefaultTerminalFactory();
        Terminal terminal = defaultTerminalFactory.createTerminal();

        MainMenu mainMenu = new MainMenu(terminal);
        Gameworld gameWorld = null;
        Context currentContext = mainMenu;

        while (true) {
            var res = currentContext.run();
            if (res == null) {
                System.out.println("Context returned null");
                return;
            }
            var enumRes = res.getEnumRes();
            switch (enumRes) {
                case StartNewGame -> {
                    gameWorld = new Gameworld(terminal);
                    currentContext = gameWorld;
                }
                case ContinueGame -> {
                    currentContext = gameWorld;
                }
                case ReturnToMainMenu -> currentContext = mainMenu;
            }
        }
    }
}