package roguelike.gameobjects;

import com.googlecode.lanterna.TextCharacter;
import roguelike.gameplay.gamelocation.GameLocation;

public class Entrance extends GameObject{
    GameLocation to;

    public Entrance(int x, int y, TextCharacter c, GameLocation to) {
        xObject = x;
        yObject = y;
        symb = c;
        this.to = to;
    }

}
