package roguelike;
import com.googlecode.lanterna.terminal.Terminal;
import roguelike.context.gameworld.Gameworld;

import java.io.IOException;

public class TestGameworld extends Gameworld {

    private String input;
    private int ind = 0;


    @Override
    public void drawWorld() throws IOException {

    }
    public TestGameworld(String input, Terminal terminal) throws IOException {
        super(terminal);
        this.input = input;
    }

    public void setInput(String input) {
        ind = 0;
        this.input = input;
    }
    public Character getKey() throws IOException {
        var ret = input.charAt(ind);
        ++ind;
        return ret;
    }
}
