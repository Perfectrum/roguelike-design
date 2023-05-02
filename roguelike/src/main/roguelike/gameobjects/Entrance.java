package roguelike.gameobjects;

import com.googlecode.lanterna.TextCharacter;
import roguelike.context.gameworld.Gameworld;
import roguelike.gamelocation.GameLocation;

/** Вход в следующую локацию */
public class Entrance extends GameObject{
    GameLocation to;
    GameLocation from;

    private int teleportToX;
    private int teleportToY;

    public int getTeleportToX() {
        return teleportToX;
    }

    public int getTeleportToY() {
        return teleportToY;
    }
    public void setTeleportToX(int teleportToX) {
        this.teleportToX = teleportToX;
    }

    public void setTeleportToY(int teleportToY) {
        this.teleportToY = teleportToY;
    }

    public GameLocation getFrom() {
        return from;
    }
    public Entrance(int x, int y, TextCharacter c, GameLocation from) {
        xObject = x;
        yObject = y;
        symb = c;
        this.from = from;
        this.to = null;
    }
    public Entrance(int x, int y, TextCharacter c,
                    GameLocation from,
                    GameLocation to,
                    int teleportToX, int teleportToY) {
        xObject = x;
        yObject = y;
        symb = c;
        this.from = from;
        this.to = to;
        this.teleportToX = teleportToX;
        this.teleportToY = teleportToY;
    }

    public GameLocation getTo() {
        return to;
    }

    /** Взаимодействие со входом, войти в следующую локацию. */
    public void interact(Gameworld gameworld) {
        if (to == null) {
            System.out.println("NULL");
            var nextEntrance = gameworld.getGameLocationFactory().
                    createHallwayFrom(4 * gameworld.getScopeRadiusX() ,
                            2 * gameworld.getScopeRadiusY() + 1,
                            this);
            System.out.println(nextEntrance);

            to = nextEntrance.getFrom();
            teleportToX = nextEntrance.getX();
            teleportToY = nextEntrance.getY();
            if (nextEntrance.getTo() == null) {
                System.out.println("OH NO!");
            }
        }

        gameworld.setGameLocation(to);
        for (var gameObject : to.getGameObjects()) {
            System.out.println(gameObject);
        }
        gameworld.setPlayerXY(teleportToX , teleportToY);
        System.out.println("called");
        System.out.println(from);
        System.out.println(this);

    }
}
