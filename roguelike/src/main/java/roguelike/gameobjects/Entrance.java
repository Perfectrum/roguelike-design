package roguelike.gameobjects;

import com.googlecode.lanterna.TextCharacter;
import roguelike.context.gameworld.Gameworld;
import roguelike.gameplay.gamelocation.GameLocation;

public class Entrance extends GameObject{
    GameLocation to;
    GameLocation from;

    public Entrance(int x, int y, TextCharacter c,
                    GameLocation from, GameLocation to) {
        xObject = x;
        yObject = y;
        symb = c;
        this.from = from;
        this.to = to;
    }

    public GameLocation getFrom() {
        return from;
    }

    public GameLocation getTo() {
        return to;
    }

    public void interact(Gameworld gameworld) {
        if (to == null) {
            to = gameworld.getGameLocationFactory().
                    createHallwayFrom(10 * gameworld.getScopeRadiusX(),
                            10 * gameworld.getScopeRadiusY(), this);
        }

        gameworld.changeLocation(to);
        gameworld.setPlayerXY(5 , 5);
        System.out.println("called");
    }
}
