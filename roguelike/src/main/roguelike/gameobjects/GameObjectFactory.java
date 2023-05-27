package roguelike.gameobjects;

import com.googlecode.lanterna.TextCharacter;
import roguelike.gameobjects.items.Item;

/**
 * Создаёт игровые объекты (GameObject),
 * в том числе выдаёт им уникальные идентификаторы, чтобы проще этими объектами было управлять.*/
public class GameObjectFactory {
    private static int nextGameObjectId = 0;

    /** Создаёт объект игрока */
    public PlayerCharacter createPlayerCharacter(int x, int y) {
        return new PlayerCharacter(nextGameObjectId++, x, y, TextCharacter.fromCharacter('@')[0]);
    }

    /** Создаёт объект добычи в котором лежит предмет */
    public Loot createLoot(int x, int y, Item item) {
        return new Loot(nextGameObjectId++, x, y, TextCharacter.fromCharacter('l')[0], item);
    }
}
