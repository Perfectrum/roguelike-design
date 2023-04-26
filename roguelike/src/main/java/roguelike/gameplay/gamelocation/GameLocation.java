package roguelike.gameplay.gamelocation;

import com.googlecode.lanterna.TextCharacter;
import roguelike.gameobjects.GameObject;
import roguelike.gameobjects.PlayerCharacter;

import java.util.ArrayList;

public class GameLocation {

    private ArrayList<GameObject> gameObjects = new ArrayList<>();
    private int width ;
    private int height;

    private ArrayList<ArrayList<TextCharacter>> location;

    GameLocation(int width, int height,
                 ArrayList<ArrayList<TextCharacter>> location) {
        this.width = width;
        this.height = height;
        this.location = location;
    }
    GameLocation(int width, int height,
                 ArrayList<ArrayList<TextCharacter>> location,
                 ArrayList<GameObject> gameObjects) {
        this.width = width;
        this.height = height;
        this.location = location;
        this.gameObjects = gameObjects;
    }
    public int getWidth() {
        return width;
    }
    public int getHeight() {
        return height;
    }

    public TextCharacter getTextCharAt(int x, int y) {
        return location.get(x).get(y);
    }

    public ArrayList<GameObject> getGameObjects() {
        return gameObjects;
    }

    public void addGameObject(GameObject gameObject) {
        gameObjects.add(gameObject);
    }

    public void removeGameObject(GameObject gameObject) {
        gameObjects.remove(gameObject);
    }

    public void setPlayerFreeCell(PlayerCharacter playerCharacter) {
        for (int i = 0; i < width; ++i) {
            for (int k = 0; k < height; ++k) {
                if (location.get(i).get(k).getCharacter() == ' ') {
                    playerCharacter.setX(i);
                    playerCharacter.setY(k);
                    return;
                }
            }
        }
    }
    public void addLoots(ArrayList<GameObject> loots) {
        int curLootNum = 0;
        for (int i = 0; i < width; ++i) {
            for (int k = 0; k < height; ++k) {
                if (location.get(i).get(k).getCharacter() == ' ') {
                    if (Math.random() < 20.0 / (double) (width * height)) {
                        var loot = loots.get(curLootNum++);
                        loot.setX(i);
                        loot.setY(k);
                        gameObjects.add(loot);
                        if (curLootNum == loots.size() - 1) {
                            return;
                        }
                    }
                }
            }
        }
    }
}
