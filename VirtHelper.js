// ==UserScript==
// @name     VirtHelper
// @version  1
// @grant    none
// ==/UserScript==

console.log('VirtAutomation script running!');

// Globals -- Globals -- Globals -- Globals -- Globals -- Globals -- Globals -- Globals -- Globals -- Globals -- Globals -- Globals -- Globals -- Globals
let tabMenu = document.querySelector('.tabu');
let automationMenu;
let currentOpenSubMenus = [];

if (!localStorage.getItem('subdivisionInfo'))
    localStorage.setItem('subdivisionInfo', '{}');

// Constants -- Constants -- Constants -- Constants -- Constants -- Constants -- Constants -- Constants -- Constants -- Constants -- Constants -- Constants
let automationOptions = {
    sale: [
        {
            text: 'Set all prices',
            subMenu: 'price',
            // func: () => setPrice('primeCost')
        }
    ],
    trading_hall: [
        {
            text: 'Update data',
            func: (e) => {
                e.preventDefault();
                updateTradeHallData();
                return false;
            }
        }
    ],
};

let subMenus = {
    price: {
        title: 'Price',
        options: [
            {
                text: 'Prime cost',
                func: (e) => {
                    e.preventDefault();
                    setPrice('primeCost');
                    closeSubMenu('Price');
                    return false;
                }
            }
        ]
    },
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
    return document.querySelector('.tabu .sel a').getAttribute('data-name').match(/--(.*)/)[1];
}

function openSubMenu(subMenu) {
    subMenu = subMenus[subMenu];
    if (currentOpenSubMenus.find((m) => m.name === subMenu.title))
        return false;

    let newMenu = addMenu(subMenu.title, subMenu.options);
    currentOpenSubMenus.push({ name: subMenu.title, element: newMenu });

    return false;
}

function closeSubMenu(subMenuName) {
    let menuIndex = currentOpenSubMenus.findIndex((m) => m.name === subMenuName);
    let menusToClose = currentOpenSubMenus.splice(menuIndex, currentOpenSubMenus.length - menuIndex);

    menusToClose.forEach(menu => {
        menu.element.remove();
    });
}

// DOM Helpers -- DOM Helpers -- DOM Helpers -- DOM Helpers -- DOM Helpers -- DOM Helpers -- DOM Helpers -- DOM Helpers -- DOM Helpers -- DOM Helpers

function addClass(element, className) {
    if (element.classList.includes(className))
        return;

    element.classList.add(className);
}

function removeClass(element, className) {
    if (!element.classList.includes(className))
        return;

    element.classList.remove(className);
}

function menuMouseOver(e) {
    e.target.closest('li.sub').querySelector('a').classList.add('sel');
    e.target.closest('li.sub').querySelector('ul.sub').classList.add('db');
}

function menuMouseOut(e) {
    let target = event.toElement || event.relatedTarget;
    if (target.closest('li.sub') === this || target === this) {
        return;
    }

    e.target.closest('li.sub').querySelector('a.sel').classList.remove('sel');
    e.target.closest('li.sub').querySelector('ul.sub.db').classList.remove('db');
}

function addMenu(title, options, ) {
    // create the automation menu
    let newMenu = createNewElement('li', { classList: "sub", onmouseenter: menuMouseOver, onmouseout: menuMouseOut }, tabMenu);
    createNewElement('a', {
        href: "#",
        innerHTML: title
    }, newMenu);

    // create the automation menu items
    let menuItems = createNewElement('ul', { classList: 'sub' }, newMenu);

    options.forEach(option => {
        let menuItem = createNewElement('li', {}, menuItems);
        createNewElement('a', {
            classList: "tabs",
            href: "#",
            innerHTML: option.text,
            onclick: option.func ? option.func : (e) => { e.preventDefault(); return openSubMenu(option.subMenu); }
        }, menuItem);
    });


    return newMenu;
}

// Logic Helpers -- Logic Helpers -- Logic Helpers -- Logic Helpers -- Logic Helpers -- Logic Helpers -- Logic Helpers -- Logic Helpers -- Logic Helpers

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

            targetPrice = parseFloat(primeCost.replace(" ", ""));
        }

        row.querySelector(':nth-child(7) input').value = targetPrice;
    });
}

function updateTradeHallData() {
    // get subdivision id
    let subdivisionId = window.location.href.match(/\d{7}/);
    if (subdivisionId && subdivisionId.length)
        subdivisionId = subdivisionId[0];

    // product processing
    let tradeHall = {};
    let rows = document.querySelectorAll('form[name="tradingHallForm"] table.grid tbody tr:not(:nth-child(1)):not(:nth-child(2)):not(:nth-child(3))');
    rows.forEach(row => {
        let title = row.querySelector('td:nth-child(3)').title;
        title = title.substr(0, title.indexOf('(') - 1);
        let salesVolume = parseInt(row.querySelector('td:nth-child(4) > a').innerHTML.replace(" ", ""));
        let inStock = parseInt(row.querySelector('td:nth-child(6)').innerHTML.replace(" ", ""));

        tradeHall[title] = { salesVolume, inStock };
    });

    let currentSubdivisionInfo = getSubdivisionInfo(subdivisionId);
    currentSubdivisionInfo.tradeHall = tradeHall;
    console.log(currentSubdivisionInfo)
    updateSubdivisionInfo(subdivisionId, currentSubdivisionInfo);
}

function getSubdivisionInfo(id) {
    return JSON.parse(localStorage.getItem('subdivisionInfo')[id] || '{}');
}

function updateSubdivisionInfo(id, updatedObj) {
    let currentValue = localStorage.getItem('subdivisionInfo');
    currentValue = JSON.parse(currentValue);
    currentValue[id] = updatedObj;

    localStorage.setItem('subdivisionInfo', JSON.stringify(currentValue));
}

// Main Logic -- Main Logic -- Main Logic -- Main Logic -- Main Logic -- Main Logic -- Main Logic -- Main Logic -- Main Logic -- Main Logic -- Main Logic

function addAutomationMenu() {
    let automationMenuOptions = getAutomationOptions(getSelectedTab())

    if (!automationMenuOptions)
        return;

    // create the automation menu
    automationMenu = addMenu('Automation', automationMenuOptions);
}

addAutomationMenu();