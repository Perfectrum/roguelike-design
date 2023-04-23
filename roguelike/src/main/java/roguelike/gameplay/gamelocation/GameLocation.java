package roguelike.gameplay.gamelocation;

import java.util.ArrayList;

public class GameLocation {
    private int width ;
    private int height;

    ArrayList<ArrayList<Character>> location;

    GameLocation(int newWidth, int newHeight,
                 ArrayList<ArrayList<Character>> newLocation) {
            width = newWidth;
            height = newHeight;
            location = newLocation;
    }
    public int getWidth() {
        return width;
    }
    public int getHeight() {
        return height;
    }

    public char getCharAt(int x, int y) {
        return location.get(x).get(y);
    }
}
