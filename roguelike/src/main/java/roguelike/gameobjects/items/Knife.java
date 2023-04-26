package roguelike.gameobjects.items;

import roguelike.gameobjects.PlayerCharacter;

public class Knife extends Item {
    int plusAtc = 10;

    public Knife() {
        description = "Vzyal nozh - znachit politic";
    }
    @Override
    public void equip(PlayerCharacter playerCharacter) {
        playerCharacter.setAtc(playerCharacter.getAtc() + plusAtc);
    }

    @Override
    public void unEquip(PlayerCharacter playerCharacter) {
        playerCharacter.setAtc(playerCharacter.getAtc() - plusAtc);
    }
    Knife(String description) {
        super(description);
    }
}
