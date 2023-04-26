package roguelike.gameobjects.items;

import roguelike.gameobjects.PlayerCharacter;

public class Sword extends EquipableItem {
    int plusAtc = 30;

    public Sword() {
        name = "Sword";
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
