package roguelike.gameplay.gamelocation;

import java.util.ArrayList;

public class GameLocationFactory {
    public GameLocation createRectangularLocation(int width, int height) {
        ArrayList<ArrayList<Character>> location = new ArrayList<>();
        for (int i = 0; i < height; ++i) {
            var line = new ArrayList<Character>();
            for (int k = 0; k < width; ++k) {
                line.add('X');
            }
            location.add(line);
        }
        return new GameLocation(width, height, location);
    }
}
