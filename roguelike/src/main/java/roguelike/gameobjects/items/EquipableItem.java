package roguelike.gameobjects.items;

import roguelike.gameobjects.PlayerCharacter;

public class EquipableItem extends Item {
    static enum Slot{
        LeftHand,
        RightHand
    }

    protected Slot slot;
    private boolean isEquiped = false;

    public boolean itemIsEquiped() {
        return isEquiped;
    }

    public void useByPlayer(PlayerCharacter playerCharacter) {
        if (!isEquiped) {
            equip(playerCharacter);
        } else {
            unEquip(playerCharacter);
        }
    }
    public void equip(PlayerCharacter playerCharacter) {
        if (isEquiped) {
            return;
        }
        isEquiped = true;
        if (slot == Slot.LeftHand) {
            playerCharacter.equipLeftHandItem(this);
        } else if (slot == Slot.RightHand) {
            playerCharacter.equipRightHandItem(this);
        }
    }

    public void unEquip(PlayerCharacter playerCharacter) {
        if (!isEquiped) {
            return;
        }
        isEquiped = false;
        if (slot == Slot.LeftHand) {
            playerCharacter.equipLeftHandItem(null);
        } else if (slot == Slot.RightHand) {
            playerCharacter.equipRightHandItem(null);
        }
    }

    public Slot getSlot() {
        return slot;
    }
}
