package roguelike.gameplay.gamelocation;

import com.googlecode.lanterna.TextCharacter;
import roguelike.gameobjects.Entrance;

import java.util.ArrayList;

public class GameLocationFactory {
    public GameLocation createRectangularLocation(int width, int height) {
        ArrayList<ArrayList<Character>> location = new ArrayList<>();
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
        return new GameLocation(width, height, location);
    }

    public GameLocation createRectangularLocationWithEntrance(int width, int height) {
        ArrayList<ArrayList<Character>> location = new ArrayList<>();
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
        var entrance = new Entrance(0, 1,
                new TextCharacter('e'), null);
        return new GameLocation(width, height, location);
    }
}
