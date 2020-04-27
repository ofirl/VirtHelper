// ==UserScript==
// @name     VirtHelper
// @version  1
// @grant    none
// ==/UserScript==

console.log('VirtAutomation script running!');

// Constants -- Constants -- Constants -- Constants -- Constants -- Constants -- Constants -- Constants -- Constants -- Constants -- Constants -- Constants
let automationOptions = {
    sale: [
        {
            text: 'Set all prices to prime cost',
            func: () => setPrice('primeCost')
        }
    ]
};

// DOM Utilities -- DOM Utilities -- DOM Utilities -- DOM Utilities -- DOM Utilities -- DOM Utilities -- DOM Utilities -- DOM Utilities -- DOM Utilities

function test() {
    console.log('test');
}

function createNewElement(tag = 'div', attrs = {}, parent = null) {
    let newElement = document.createElement(tag);

    for (let attr in attrs)
        newElement[attr] = attrs[attr];

    parent.appendChild(newElement);

    return newElement;
}

function getSelectedTab() {
    return document.querySelector('.tabu .sel a').getAttribute('data-name').match(/--(.*)/)[1]
}

// Helpers -- Helpers -- Helpers -- Helpers -- Helpers -- Helpers -- Helpers -- Helpers -- Helpers -- Helpers -- Helpers -- Helpers -- Helpers -- Helpers
function getAutomationOptions(tab) {
    return automationOptions[tab];
}

function setPrice(price) {
    // normal case - price is a number
    let targetPrice = price;

    let productRows = document.querySelectorAll('form[name="storageForm"] table.grid > tbody > tr:not(:first-child):not([class~="empty-qty"])');
    productRows.forEach(row => {
        // special cases
        if (price === "primeCost") {
            let primeCost = row.querySelector(':nth-child(4) table tbody tr:nth-child(3) td:nth-child(2)').innerHTML;
            primeCost = primeCost.substr(1, primeCost.length - 1);

            targetPrice = parseFloat(primeCost);
        }

        row.querySelector(':nth-child(7) input').value = targetPrice;
    });
}

// Main Logic -- Main Logic -- Main Logic -- Main Logic -- Main Logic -- Main Logic -- Main Logic -- Main Logic -- Main Logic -- Main Logic -- Main Logic

function addAutomationMenu() {
    let automationMenuOptions = getAutomationOptions(getSelectedTab())

    if (!automationMenuOptions)
        return;

    let tabMenu = document.querySelector('.tabu');

    // create the automation menu
    let automationMenu = createNewElement('li', { classList: "sub" }, tabMenu);
    createNewElement('a', { href: "#", innerHTML: "Automation" }, automationMenu);

    // create the automation menu items
    let automationMenuItems = createNewElement('ul', { classList: 'sub' }, automationMenu);
    let menuItem;

    automationMenuOptions.forEach(option => {
        menuItem = createNewElement('li', {}, automationMenuItems);
        createNewElement('a', { href: "#", classList: "tabs", innerHTML: option.text, onclick: option.func }, menuItem);
    });
}

addAutomationMenu();