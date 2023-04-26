package roguelike.gameplay.gamelocation;

import roguelike.gameobjects.GameObject;

import java.util.ArrayList;

public class GameLocation {

    private ArrayList<GameObject> gameObjects = new ArrayList<>();
    private int width ;
    private int height;

    private ArrayList<ArrayList<Character>> location;

    GameLocation(int width, int height,
                 ArrayList<ArrayList<Character>> location) {
        this.width = width;
        this.height = height;
        this.location = location;
    }
    GameLocation(int width, int height,
                 ArrayList<ArrayList<Character>> location,
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

    public char getCharAt(int x, int y) {
        return location.get(x).get(y);
    }

    public ArrayList<GameObject> getGameObjects() {
        return gameObjects;
    }

    public void addGameObject(GameObject gameObject) {
        gameObjects.add(gameObject);
    }
}
