package roguelike.gameobjects;

import com.googlecode.lanterna.TextCharacter;
import roguelike.context.gameworld.Gameworld;
/**
 * Игровые объекты, которые могут быть расположены на карте
 * */
public class GameObject {
    protected int id;
    protected TextCharacter symb;
    protected int xObject;
    protected int yObject;

    /** Вызывается когда игрок взаимодействует с игровым объектом
     *  */
    public void interact(Gameworld gameworld) {
    }

    public int getX() {
        return xObject;
    }

    public void setX(int x) {
        this.xObject = x;
    }

    public int getY() {
        return yObject;
    }

    public void setY(int y) {
        this.yObject = y;
    }

    public TextCharacter getSymb() {
        return symb;
    }
}
