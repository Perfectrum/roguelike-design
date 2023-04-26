package roguelike.gameobjects.items;

import roguelike.gameobjects.PlayerCharacter;

public class Item {
    protected String name = "";

    public String getName() {
        return name;
    }

    public Item() {
    }

    public String getDescription() {
        return name;
    }

    public void useByPlayer(PlayerCharacter playerCharacter) {

    }

    Item(String description) {
        this.name = description;
    }
}
