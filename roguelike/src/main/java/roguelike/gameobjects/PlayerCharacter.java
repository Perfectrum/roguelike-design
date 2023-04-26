package roguelike.gameobjects;

import com.googlecode.lanterna.TextCharacter;
import roguelike.gameobjects.items.Item;

import java.util.ArrayList;

public class PlayerCharacter extends GameObject {
    public PlayerCharacter(int id, int x, int y, TextCharacter symb) {
        this.id = id;
        xObject = x;
        yObject = y;
        this.symb = symb;
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

    private final Inventory inventory = new Inventory();

    public Inventory getInventory() {
        return inventory;
    }

    public class Inventory {
        private final ArrayList<Item> items = new ArrayList<Item>();

        public Inventory() {}

        public void addItem(Item item) {
            System.out.println(item.getDescription() + " added");
            items.add(item);
        }
    }
}
