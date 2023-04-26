package roguelike.gameobjects;

import com.googlecode.lanterna.TextCharacter;
import roguelike.gameobjects.items.EquipableItem;
import roguelike.gameobjects.items.Item;

import java.util.ArrayList;

public class PlayerCharacter extends GameObject {
    EquipableItem leftHandItem = null;
    EquipableItem rightHandItem = null;

    public void equipLeftHandItem(EquipableItem item) {
        if (leftHandItem != null) {
            leftHandItem.unEquip(this);
        }
        leftHandItem = null;
        leftHandItem = item;
    }

    public void equipRightHandItem(EquipableItem item) {
        if (rightHandItem != null) {
            rightHandItem.unEquip(this);
        }
        rightHandItem = null;
        rightHandItem = item;
    }

    public PlayerCharacter(int id, int x, int y, TextCharacter symb) {
        this.id = id;
        xObject = x;
        yObject = y;
        this.symb = symb;
    }

    public void leftStep() {
        --xObject;
    }
    public void rightStep() {
        ++xObject;
    }
    public void upStep() {
        --yObject;
    }
    public void downStep() {
        ++yObject;
    }

    private int atc = 5;

    private int def = 0;

    private int hp = 100;

    public int getAtc() {
        return atc;
    }
    public void setAtc(int atc) {
        this.atc = atc;
    }

    public int getDef() {
        return def;
    }
    public void setDef(int def) {
        this.def = def;
    }

    private final Inventory inventory = new Inventory();

    public Inventory getInventory() {
        return inventory;
    }

    public class Inventory {
        private final ArrayList<Item> items = new ArrayList<Item>();

        public Inventory() {}

        public Item getItem(int ind) {
            return items.get(ind);
        }
        public void addItem(Item item) {
            System.out.println(item.getDescription() + " added");
            items.add(item);
        }

        public ArrayList<Item> getItems() {
            return items;
        }
    }
}
