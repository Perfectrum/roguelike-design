package roguelike.gameobjects;

import com.googlecode.lanterna.TextCharacter;
import roguelike.gameobjects.items.EquipableItem;
import roguelike.gameobjects.items.Item;

import java.util.ArrayList;
/** Хранит координаты где находится игрок,
 *  его характеристики и инвентарь. */
public class PlayerCharacter extends GameObject {
    EquipableItem leftHandItem = null;
    EquipableItem rightHandItem = null;


    /** Взять предмет в левую руку */
    public void equipLeftHandItem(EquipableItem item) {
        if (leftHandItem != null) {
            leftHandItem.unEquip(this);
        }
        leftHandItem = null;
        leftHandItem = item;
    }

    /** Взять предмет в правую руку */
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

    /** Шаг влево. */
    public void leftStep() {
        --xObject;
    }

    /** Шаг вправо. */
    public void rightStep() {
        ++xObject;
    }

    /** Шаг вверх */
    public void upStep() {
        --yObject;
    }

    /** Шаг вниз */
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
    /** Хранит предметы (item) полученные игроком. */
    public class Inventory {
        private final ArrayList<Item> items = new ArrayList<Item>();

        public Inventory() {}

        public Item getItem(int ind) {
            return items.get(ind);
        }
        public void addItem(Item item) {
            System.out.println(item.getName() + " added");
            items.add(item);
        }

        public ArrayList<Item> getItems() {
            return items;
        }
    }
}
