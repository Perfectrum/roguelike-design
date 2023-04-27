package roguelike.gameobjects.items;

import roguelike.gameobjects.PlayerCharacter;

/** Класс одеваемых предметов */
public class EquipableItem extends Item {
    static enum Slot{
        LeftHand,
        RightHand
    }

    protected Slot slot;
    private boolean isEquiped = false;

    /** Сообщает одет ли данный предмет */
    public boolean itemIsEquiped() {
        return isEquiped;
    }

    /** Одевает или снимает предмет с игрока */
    public void useByPlayer(PlayerCharacter playerCharacter) {
        if (!isEquiped) {
            equip(playerCharacter);
        } else {
            unEquip(playerCharacter);
        }
    }

    /** Одевает предмет
     *  на игрока в соответствующий слот */
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

    /** Снимает предмет
     *  с игрока с соответствующего слота */
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

    /** Возвращает слот-место куда одевается предмет */
    public Slot getSlot() {
        return slot;
    }
}
