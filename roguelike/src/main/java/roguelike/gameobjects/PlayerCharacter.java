package roguelike.gameobjects;

import com.googlecode.lanterna.TextCharacter;

public class PlayerCharacter extends GameObject {
    public PlayerCharacter(int x, int y, TextCharacter c) {
        xObject = x;
        yObject = y;
        symb = c;
    }

    private int str = 10;
    private int agi = 10;

    private int atc = 5;

    public int getAtc() {
        return atc;
    }
    public void setAtc(int atc) {
        this.atc = atc;
    }
}
