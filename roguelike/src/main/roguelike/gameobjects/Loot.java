package roguelike.gameobjects;

import com.googlecode.lanterna.TextCharacter;
import roguelike.context.gameworld.Gameworld;
import roguelike.gameobjects.items.Item;
/**
 * Хранит координаты где находится добыча, в которой содержится предмет,
 * игрок может взаимодействовать с ней кнопкой e, забирая предмет в инвентарь. */
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

    /** Забрать предмет и удалить loot */
    @Override
    public void interact(Gameworld gameworld) {
        gameworld.getPlayer().getInventory().addItem(item);
        gameworld.getGameLocation().removeGameObject(this);
    }
}
