package roguelike.gameobjects.items;

import roguelike.gameobjects.PlayerCharacter;

public class Knife extends EquipableItem {
    int plusAtc = 10;
    public Knife() {
        name = "Knife";
        slot = Slot.RightHand;
    }

    @Override
    public void equip(PlayerCharacter playerCharacter) {
        super.equip(playerCharacter);
        playerCharacter.setAtc(playerCharacter.getAtc() + plusAtc);
    }

    @Override
    public void unEquip(PlayerCharacter playerCharacter) {
        super.unEquip(playerCharacter);
        playerCharacter.setAtc(playerCharacter.getAtc() - plusAtc);
    }
}
