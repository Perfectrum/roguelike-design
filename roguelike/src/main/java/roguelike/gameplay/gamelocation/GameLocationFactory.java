package roguelike.gameplay.gamelocation;

import com.googlecode.lanterna.TextCharacter;
import roguelike.gameobjects.Entrance;
import roguelike.gameobjects.GameObject;
import roguelike.gameobjects.GameObjectFactory;
import roguelike.gameobjects.items.Knife;
import roguelike.gameobjects.items.Shield;
import roguelike.gameobjects.items.Sword;

import java.util.ArrayList;

public class GameLocationFactory {
    private GameObjectFactory gameObjectFactory;
    public GameLocationFactory(GameObjectFactory gameObjectFactory) {
        this.gameObjectFactory = gameObjectFactory;
    }

    private ArrayList<ArrayList<TextCharacter>> getFramedLocation(
            int width, int height) {
        var location = new ArrayList<ArrayList<TextCharacter>> ();
        for (int i = 0; i < width; ++i) {
            var line = new ArrayList<TextCharacter>();
            if (i == 0 || i == width - 1) {
                for (int k = 0; k < height; ++k) {
                    line.add(new TextCharacter('X'));
                }
            } else {
                line.add(new TextCharacter('X'));
                for (int k = 1; k < height - 1; ++k) {
                    line.add(new TextCharacter(' '));
                }
                line.add(new TextCharacter('X'));
            }
            location.add(line);
        }
        return location;
    }

    private ArrayList<ArrayList<TextCharacter>> getRandomLinesLocation(
            int width, int height) {
        var location = new ArrayList<ArrayList<TextCharacter>> ();
        for (int i = 0; i < width; ++i) {
            var line = new ArrayList<TextCharacter>();
            if (i == 0 || i == width - 1) {
                for (int k = 0; k < height; ++k) {
                    line.add(new TextCharacter('X'));
                }
            } else {
                int left = (int)(Math.random() * (((double)width) / 5.0));
                int right = width - 1 - (int)(Math.random() * (((double)width) / 5.0));
                line.add(new TextCharacter('X'));
                for (int k = 1; k < height - 1; ++k) {
                    if (k <= left || right <= k) {
                        line.add(new TextCharacter('X'));
                    } else {
                        line.add(new TextCharacter(' '));
                    }
                }
                line.add(new TextCharacter('X'));
            }
            location.add(line);
        }
        return location;
    }
    public GameLocation createRectangularLocation(int width, int height) {
        var location = getFramedLocation(width, height);
        return new GameLocation(width, height, location);
    }

    public GameLocation createRandomLinesGameLocation(int width, int height) {
        var location = getRandomLinesLocation(width, height);
        var gameLocation = new GameLocation(width, height, location);

        var loots = new ArrayList<GameObject>();
        loots.add(gameObjectFactory.createLoot(0, 0, new Knife()));
        loots.add(gameObjectFactory.createLoot(0, 0, new Knife()));
        loots.add(gameObjectFactory.createLoot(0, 0, new Sword()));
        loots.add(gameObjectFactory.createLoot(0, 0, new Shield()));
        loots.add(gameObjectFactory.createLoot(0, 0, new Shield()));
        loots.add(gameObjectFactory.createLoot(0, 0, new Shield()));

        gameLocation.addLoots(loots);

        return gameLocation;
    }

    public GameLocation createRectangularLocationWithLoot(int width, int height) {
        var location = getFramedLocation(width, height);
        var gameLocation = new GameLocation(width, height, location);
        var loot1 = gameObjectFactory.createLoot(3, 10, new Knife());
        gameLocation.addGameObject(loot1);
        return gameLocation;
    }

    public Entrance createHallwayFrom(int width,
                                          int height,
                                          Entrance entranceFrom) {
        var location = getFramedLocation(width, height);
        var gameLocation = new GameLocation(width, height, location);

        if (entranceFrom.getY() != 3) {
            System.out.println("Got here");
        }

        var entranceNextMap = new Entrance(3, 3,
                new TextCharacter('e'), gameLocation,
                entranceFrom.getFrom(),
                entranceFrom.getX(), entranceFrom.getY());

        var entranceNextMapFurther = new Entrance(width - 3, height - 3,
                new TextCharacter('e'), gameLocation);

        gameLocation.addGameObject(entranceNextMap);
        gameLocation.addGameObject(entranceNextMapFurther);
        return entranceNextMap;
    }
}
