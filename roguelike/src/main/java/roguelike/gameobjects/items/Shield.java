package roguelike.gameobjects.items;
import roguelike.gameobjects.PlayerCharacter;

public class Shield extends EquipableItem {
    int plusDef = 10;

    public Shield() {
        name = "Shield";
        slot = Slot.LeftHand;
    }
    @Override
    public void equip(PlayerCharacter playerCharacter) {
        super.equip(playerCharacter);
        playerCharacter.setDef(playerCharacter.getAtc() + plusDef);
    }

    @Override
    public void unEquip(PlayerCharacter playerCharacter) {
        super.unEquip(playerCharacter);
        playerCharacter.setDef(playerCharacter.getDef() - plusDef);
    }
}
