package roguelike.gameobjects.items;

import roguelike.gameobjects.PlayerCharacter;

public class Item {
    protected String description = "";

    public Item() {
    }

    public String getDescription() {
        return description;
    }
    public void equip(PlayerCharacter playerCharacter) {
    }

    public void unEquip(PlayerCharacter playerCharacter) {
    }
    Item(String description) {
        this.description = description;
    }
}
