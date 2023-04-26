package roguelike.gameobjects;

import com.googlecode.lanterna.TextCharacter;
import roguelike.gameobjects.items.Item;

public class GameObjectFactory {
    private static int nextGameObjectId = 0;
    public PlayerCharacter createPlayerCharacter(int x, int y) {
        return new PlayerCharacter(nextGameObjectId++, x, y, new TextCharacter('@'));
    }

    public Loot createLoot(int x, int y, Item item) {
        return new Loot(nextGameObjectId++, x, y, new TextCharacter('l'), item);
    }
}
