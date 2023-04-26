package roguelike.gameobjects;

import com.googlecode.lanterna.TextCharacter;
import roguelike.gameobjects.items.Item;

public class Loot extends GameObject {
    Item item;
    Loot(int x, int y, TextCharacter c, Item item) {
        xObject = x;
        yObject = y;
        symb = c;
        this.item = item;
    }
}
