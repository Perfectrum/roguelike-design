package roguelike;


import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.io.IOException;

public class TestPlayerStep {
    @Test
    public void testPlayerStep1() throws IOException, InterruptedException {
        TestGameworld gameworld = new TestGameworld("sssswwwwq", null);

        int width = 20;
        int height = 20;
        var gameLocation = gameworld.getGameLocationFactory().createRectangularLocation(width, height);
        gameworld.setGameLocation(gameLocation);
        gameworld.setPlayerXY(2, 2);
        var player = gameworld.getPlayer();

        gameworld.run();
        Assertions.assertEquals(2, player.getX());
        Assertions.assertEquals(2 ,player.getY());

        gameworld.setInput("ddddddddq");
        gameworld.run();
        Assertions.assertEquals(10, player.getX());
        Assertions.assertEquals(2 ,player.getY());

        gameworld.setInput("wwwwwwwwwwq");
        gameworld.run();
        Assertions.assertEquals(10, player.getX());
        Assertions.assertEquals(1 ,player.getY());

        gameworld.setInput("ssssdq");
        gameworld.run();
        Assertions.assertEquals(11, player.getX());
        Assertions.assertEquals(5, player.getY());

        gameworld.setInput("ddddddddddddddddddq");
        gameworld.run();
        Assertions.assertEquals(width - 2, player.getX());
        Assertions.assertEquals(5, player.getY());
    }

    @Test
    public void testPlayerStep2() throws IOException, InterruptedException {
        TestGameworld gameworld = new TestGameworld("ssssssq", null);

        int width = 40;
        int height = 40;
        var gameLocation = gameworld.getGameLocationFactory().createRandomLinesGameLocation(width, height);
        gameworld.setGameLocation(gameLocation);
        var player = gameworld.getPlayer();
        gameLocation.setPlayerFreeCell(player);
        var x = player.getX();
        var y = player.getY();

        gameworld.run();
        Assertions.assertEquals(x, player.getX());
        Assertions.assertTrue( player.getY() <= y + 6);

        gameworld.setInput("aaaaaq");
        gameworld.run();
        Assertions.assertTrue(player.getX() <= x);
        Assertions.assertTrue( player.getY() <= y + 6);
    }
}
