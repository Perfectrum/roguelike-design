package roguelike.test;

import com.googlecode.lanterna.terminal.DefaultTerminalFactory;
import com.googlecode.lanterna.terminal.Terminal;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import roguelike.gameobjects.items.Knife;
import roguelike.gameobjects.items.Shield;
import roguelike.gameobjects.items.Sword;

import java.io.IOException;


public class TestInventory {
    @org.junit.Test
    public void testInventory1() throws IOException, InterruptedException {
        DefaultTerminalFactory defaultTerminalFactory = new DefaultTerminalFactory();
        Terminal terminal = defaultTerminalFactory.createTerminal();

        TestGameworld gameworld = new TestGameworld("i010iq", terminal);

        int width = 20;
        int height = 20;
        var gameLocation = gameworld.getGameLocationFactory().createRectangularLocation(width, height);
        gameworld.setGameLocation(gameLocation);
        gameworld.setPlayerXY(2, 2);
        var player = gameworld.getPlayer();

        var knife = new Knife();
        var sword = new Sword();
        var shield = new Shield();

        player.getInventory().addItem(knife);
        player.getInventory().addItem(sword);
        player.getInventory().addItem(shield);

        gameworld.run();

        Assertions.assertTrue(knife.itemIsEquiped());
        Assertions.assertFalse(sword.itemIsEquiped());
        Assertions.assertFalse(shield.itemIsEquiped());
        knife.unEquip(player);

        gameworld.setInput("i012012iq");
        gameworld.run();

        Assertions.assertFalse(knife.itemIsEquiped());
        Assertions.assertTrue(sword.itemIsEquiped());
        Assertions.assertFalse(shield.itemIsEquiped());
        sword.unEquip(player);

        gameworld.setInput("i0120122iq");
        gameworld.run();

        Assertions.assertFalse(knife.itemIsEquiped());
        Assertions.assertTrue(sword.itemIsEquiped());
        Assertions.assertTrue(shield.itemIsEquiped());
    }
}
