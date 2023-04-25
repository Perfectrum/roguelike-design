package roguelike.gameplay.gamelocation;

import com.googlecode.lanterna.TextCharacter;
import roguelike.gameobjects.Entrance;
import roguelike.gameobjects.GameObject;

import java.util.ArrayList;

public class GameLocationFactory {

    private ArrayList<ArrayList<Character>> getFramedLocation(
            int width, int height) {
        var location = new ArrayList<ArrayList<Character>> ();
        for (int i = 0; i < height; ++i) {
            var line = new ArrayList<Character>();
            if (i == 0 || i == height - 1) {
                for (int k = 0; k < width; ++k) {
                    line.add('X');
                }
            } else {
                line.add('X');
                for (int k = 1; k < width - 1; ++k) {
                    line.add(' ');
                }
                line.add('X');
            }
            location.add(line);
        }
        return location;
    }
    public GameLocation createRectangularLocation(int width, int height) {
        var location = getFramedLocation(width, height);
        return new GameLocation(width, height, location);
    }

    public GameLocation createRectangularLocationWithEntrance(int width, int height) {
        var location = getFramedLocation(width, height);
        var gameObjects = new ArrayList<GameObject>();
        var gameLocation = new GameLocation(width, height, location, gameObjects);
        var entrance = new Entrance(3, 3,
                new TextCharacter('e'), gameLocation, null);
        gameObjects.add(entrance);
        return gameLocation;
    }

    public GameLocation createHallwayFrom(int width,
                                          int height,
                                          Entrance entranceFrom) {
        var location = getFramedLocation(width, height);
        var entranceTo = new Entrance(3, 3,
                new TextCharacter('e'), entranceFrom.getTo(), entranceFrom.getFrom());
        var entranceNext = new Entrance(width - 3, height - 3,
                new TextCharacter('e'), entranceFrom.getTo(), null);
        var gameObjects = new ArrayList<GameObject>();
        gameObjects.add(entranceTo);
        gameObjects.add(entranceNext);
        return new GameLocation(width, height, location, gameObjects);
    }
}
