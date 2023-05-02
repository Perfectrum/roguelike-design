package roguelike.gameobjects.items;

import roguelike.gameobjects.PlayerCharacter;

public class Item {
    protected String name = "";

    public String getName() {
        return name;
    }

    public Item() {
    }

    public void useByPlayer(PlayerCharacter playerCharacter) {

    }

    Item(String name) {
        this.name = name;
    }
}
