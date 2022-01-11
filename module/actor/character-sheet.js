console.log('>> Wc5e: Initializing Character Sheet');

import ActorSheet5eCharacter from '../../../../systems/dnd5e/module/actor/sheets/character.js';
import {renderWcDescription} from "../util.js"

/*
 * Actor Sheet for player characters
 */
export class WcCharacterSheet extends ActorSheet5eCharacter {

    constructor(...args) {
        super(...args);
        this.options.classes = ['warcraft5e', 'dnd5e', 'sheet', 'actor', 'character'];
        this.options.width = this.position.width = 850;
        this.options.height = this.position.height = 800;
    }

    /** @override */
    get template() {
        return `modules/warcraft5e/templates/actor/character-sheet.html`;
    }

    /**
     * Handle toggling and items expanded description.
     * @param {Event} event   Triggering event.
     * @private
     */
    _onItemSummary(event) {
        event.preventDefault();
        const li = $(event.currentTarget).parents(".item");
        const item = this.actor.items.get(li.data("item-id"));
        const chatData = item.getChatData({secrets: this.actor.isOwner});

        // Toggle summary
        if (li.hasClass("expanded")) {
            let summary = li.children(".item-summary");
            summary.slideUp(200, () => summary.remove());
        } else {
            let summary = chatData.description.value;
            let props;
            if (typeof (item.data.flags.wc5e) !== 'undefined') {
                props = renderWcDescription(item.data.flags.wc5e.description);
            } else {
                props = $('<div class="item-properties"></div>');
                chatData.properties.forEach(p => props.append(`<span class="tag">${p}</span>`));
            }
            let div = $(`<div class="item-summary">${summary}</div>`);
            div.append(props);
            li.append(div.hide());
            div.slideDown(200);
        }
        li.toggleClass("expanded");
    }
}

Actors.registerSheet('warcraft5e', WcCharacterSheet, {
    label: 'Warcraft 5e - Character Sheet',
    makeDefault: true
});