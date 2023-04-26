package roguelike.gameobjects;

import com.googlecode.lanterna.TextCharacter;
import roguelike.context.gameworld.Gameworld;
import roguelike.gameobjects.items.Item;

public class Loot extends GameObject {
    Item item;
    Loot(int id, int x, int y,
         TextCharacter symb, Item item) {
        this.id = id;
        xObject = x;
        yObject = y;
        this.symb = symb;
        this.item = item;
    }

    @Override
    public void interact(Gameworld gameworld) {
        gameworld.getPlayer().getInventory().addItem(item);
        gameworld.getGameLocation().removeGameObject(this);
    }
}
