package roguelike.gameplay.gamelocation;

import com.googlecode.lanterna.TextCharacter;
import roguelike.gameobjects.Entrance;
import roguelike.gameobjects.GameObject;

import java.util.ArrayList;

public class GameLocationFactory {

    private ArrayList<ArrayList<Character>> getFramedLocation(
            int width, int height) {
        var location = new ArrayList<ArrayList<Character>> ();
        for (int i = 0; i < width; ++i) {
            var line = new ArrayList<Character>();
            if (i == 0 || i == width - 1) {
                for (int k = 0; k < height; ++k) {
                    line.add('X');
                }
            } else {
                line.add('X');
                for (int k = 1; k < height - 1; ++k) {
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
        var gameLocation = createRectangularLocation(width, height);
        var entrance = new Entrance(3, 3,
                new TextCharacter('e'), gameLocation);
        gameLocation.addGameObject(entrance);
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
