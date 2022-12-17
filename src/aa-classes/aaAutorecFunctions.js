//import { autoRecMigration } from "../mergeScripts/autorec/autoRecMerge.js";
import { custom_warning } from "../constants/constants";

export class AAAutorecFunctions {

    static rinseName(oldName) {
        if (!oldName) { return; }
        const newName = oldName.replace(/\s+/g, '').toLowerCase();
        return newName;
    }

    static sortAndFilterMenus() {
        /*
        let combinedMenus = [...menus.melee, ...menus.range, ...menus.ontoken,
            ...menus.templatefx, ...menus.aura, ...menus.preset];
        let sortedMenus = combinedMenus.sort((a, b) => b.label?.replace(/\s+/g, '').length - a.label?.replace(/\s+/g, '').length);

        let  exactMatchMenus = sortedMenus.filter(x => x.exactMatch);
        let looseMatchMenus = sortedMenus.filter(x => !x.exactMatch);
        */

        let combinedMenus = [...menus.melee, ...menus.range, ...menus.ontoken,
            ...menus.templatefx, ...menus.aura, ...menus.preset];

        let sortedMenus = combinedMenus.sort((a, b) => b.label?.replace(/\s+/g, '').length - a.label?.replace(/\s+/g, '').length);
        return {
            exactMatchMenus: sortedMenus.filter(x => x.exactMatch),
            bestMatchMenus: sortedMenus.filter(x => !x.exactMatch),
        }
    }

    static allMenuSearch(menus, rinsedName, trueName) {
        return menus.exactMatchMenus.find(x => x.label && x.label === trueName) || menus.bestMatchMenus.find(x => x.label && rinsedName.includes(this.rinseName(x.label))) || false;
    }

    static singleMenuSearch(menu, name) {

        if (!name) { 
            custom_warning("No Name was provided for the Global Menu search")
            return;
        }

        let sortedMenu = menu.sort((a, b) => b.label.replace(/\s+/g, '').length - a.label?.replace(/\s+/g, '').length);

        let exactMatchMenus = sortedMenu.filter(x => x.exactMatch);
        let bestMatchMenus = sortedMenu.filter(x => !x.exactMatch);

        return exactMatchMenus.find(x => x.label && x.label === trueName) || bestMatchMenus.find(x => x.label && name.includes(this.rinseName(x.label))) || false;
        //return sortedMenu.find(x => name.includes(this.rinseName(x.label))) || false;
    }

    static singleMenuStrictSearch(menu, name) {

        if (!name) { 
            custom_warning("No Name was provided for the Global Menu search")
            return;
        }

        return menu.find(x => name === this.rinseName(x.label)) || false;
    }

    static getAllLabelsInMenu(menu) {

        const nameArray = []

        for (var i = 0; i < menu.length; i++) {
            if (!menu[i].label) { continue }
            nameArray.push(this.rinseName(menu[i].label))
        }
        return nameArray;
    }

    static sortMenu(menu) {

        let sortedMenu = menu.sort((a, b) => b.label.replace(/\s+/g, '').length - a.label.replace(/\s+/g, '').length);

        return sortedMenus;
    }

}