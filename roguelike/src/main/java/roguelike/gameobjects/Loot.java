package roguelike.gameobjects;

import com.googlecode.lanterna.TextCharacter;

public class Loot extends GameObject {
    Loot(int x, int y, TextCharacter c) {
        xObject = x;
        yObject = y;
        symb = c;
    }
}
