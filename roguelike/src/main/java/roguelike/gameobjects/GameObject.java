package roguelike.gameobjects;

import com.googlecode.lanterna.TextCharacter;
import org.w3c.dom.Text;

import java.awt.*;

public class GameObject {
    protected TextCharacter symb;
    protected int xObject;
    protected int yObject;

    public void setSymb(TextCharacter symb) {
        this.symb = symb;
    }
    public void setxObject(int x) {
        xObject = x;
    }

    public void setyObject(int y) {
        yObject = y;
    }

    public int getxObject() {
        return xObject;
    }

    public void setX(int x) {
        this.xObject = x;
    }

    public int getyObject() {
        return yObject;
    }

    public void setY(int y) {
        this.yObject = y;
    }

    public TextCharacter getSymb() {
        return symb;
    }
}
