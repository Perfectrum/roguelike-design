package roguelike.gameobjects;

import com.googlecode.lanterna.TextCharacter;

public class PlayerCharacter extends GameObject {
    public PlayerCharacter(int x, int y, TextCharacter c) {
        xObject = x;
        yObject = y;
        symb = c;
    }

    int str = 10;
    int agi = 10;

}
