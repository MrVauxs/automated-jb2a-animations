import { flagMigrations } from "../mergeScripts/items/itemFlagMerge.js";
import { AAAutorecFunctions } from "../aa-classes/aaAutorecFunctions.js";

export async function handleItem(data) {

    // GTFO if no Item was sent
    if (!data.item) { return; };

    const item = data.item;
    const itemName = !data.activeEffect || game.system.id === "pf2e" ? item.name : item.label;
    const rinsedItemName = itemName ? AAAutorecFunctions.rinseName(itemName) : "noitem";

    const ammoItem = data.ammoItem;
    const rinsedAmmoName = ammoItem?.name ? AAAutorecFunctions.rinseName(ammoItem.name) : "";

    // Send Item thru Flag Merge
    const itemFlags = await flagMigrations.handle(data.item, {activeEffect: data.activeEffect}) || {};
    // If Item has Ammunition send it thru the Flag Merge
    const ammoFlags = ammoItem ? await flagMigrations.handle(ammoItem, {activeEffect: data.activeEffect}) || {} : null;
    
    const autorecSettings = {
        melee: game.settings.get("autoanimations", "aaAutorec-melee"),
        range: game.settings.get("autoanimations", "aaAutorec-range"),
        ontoken: game.settings.get("autoanimations", "aaAutorec-ontoken"),
        templatefx: game.settings.get("autoanimations", "aaAutorec-templatefx"),
        aura: game.settings.get("autoanimations", "aaAutorec-aura"),
        preset: game.settings.get("autoanimations", "aaAutorec-preset"),
        aefx: game.settings.get("autoanimations", "aaAutorec-aefx"),
    }

    let menus = AAAutorecFunctions.sortAndFilterMenus(autorecSettings)

    let autorecObject;

    // If Item has Ammo, search for matching animations. If found, return it, otherwise keep going
    if (ammoItem && ammoFlags.isEnabled) {
        if (ammoFlags.isCustomized) {
            return ammoFlags;
        } else {
            autorecObject = AAAutorecFunctions.allMenuSearch(menus, rinsedAmmoName, ammoItem?.name || "");
        }
        if (autorecObject) { return autorecObject }
    } 
    
    if (data.activeEffect) {
        if (itemFlags.isCustomized) {
            return itemFlags
        } else {
            autorecObject = AAAutorecFunctions.singleMenuSearch(autorecSettings.aefx, rinsedItemName, itemName);
            return autorecObject;
        }
    } else {
        if (itemFlags.isCustomized) {
            return itemFlags;
        } else {
            autorecObject = AAAutorecFunctions.allMenuSearch(menus, rinsedItemName, itemName);
            if (!autorecObject && data.extraNames?.length && !data.activeEffect) {
                for (const name of data.extraNames) {
                    const rinsedName = AAAutorecFunctions.rinseName(name);
                    autorecObject = AAAutorecFunctions.allMenuSearch(menus, rinsedName, itemName);
                    if (autorecObject) {
                        data.rinsedName = rinsedName;
                        break;
                    }
                }
            }
        }    
    }
    if (autorecObject && data.isTemplate) {
        let data = autorecObject;
        if (data.menu === "range" || data.menu === "melee" || data.menu === "ontoken") {
            autorecObject = AAAutorecFunctions.singleMenuSearch(autorecSettings.templatefx, rinsedItemName, itemName);
        }
    }
    return autorecObject;
}