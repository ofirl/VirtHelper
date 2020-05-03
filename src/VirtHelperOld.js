// ==UserScript==
// @name     VirtHelper
// @version  1
// @grant    none
// ==/UserScript==

// Settings -- Settings -- Settings -- Settings -- Settings -- Settings -- Settings -- Settings -- Settings -- Settings -- Settings -- Settings -- Settings
let storeSupplySparesPercent = 0.1;

console.log('VirtAutomation script running!');

// Globals -- Globals -- Globals -- Globals -- Globals -- Globals -- Globals -- Globals -- Globals -- Globals -- Globals -- Globals -- Globals -- Globals
let tabMenu = document.querySelector('ul.tabu');

let subdivisionType = document.querySelector('ul.tabu > li:nth-child(2) > a');
if (subdivisionType)
    subdivisionType = subdivisionType.innerHTML.trim();

let selectedTab = document.querySelector('ul.tabu li.sel a');
if (selectedTab)
    selectedTab = selectedTab.getAttribute('data-name').match(/--(.*)/)[1];

let automationMenu;
let currentOpenSubMenus = [];

let subdivisionId = window.location.href.match(/\d{7}/);
if (subdivisionId && subdivisionId.length)
    subdivisionId = subdivisionId[0];

if (!localStorage.getItem('subdivisionInfo'))
    localStorage.setItem('subdivisionInfo', '{}');

let currentSubdivisionInfo = getSubdivisionInfo(subdivisionId);

// Constants -- Constants -- Constants -- Constants -- Constants -- Constants -- Constants -- Constants -- Constants -- Constants -- Constants -- Constants
let automationOptions = {
    Warehouse: {
        sale: [
            {
                text: 'Set all prices',
                subMenu: 'price',
            }
        ],
        supply: [
            {
                text: 'Calculate orders',
                func: calculateWarehouseSupplyOrders,
            }
        ]
    },
    Store: {
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
        supply: [
            {
                text: 'Calculate Orders',
                func: (e) => {
                    e.preventDefault();
                    calculateStoreSupplyOrders();
                    return false;
                }
            }
        ],
    }
};

let subMenus = {
    price: {
        title: 'Price',
        options: [
            {
                text: 'Prime cost',
                func: (e) => {
                    e.preventDefault();
                    setSalePrice('primeCost');
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

    if (parent)
        parent.appendChild(newElement);

    return newElement;
}

function getSelectedTab() {
    return document.querySelector('ul.tabu li.sel a').getAttribute('data-name').match(/--(.*)/)[1];
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

// State -- State -- State -- State -- State -- State -- State -- State -- State -- State -- State -- State -- State -- State -- State -- State -- State

function getSubdivisionInfo(id) {
    return JSON.parse(localStorage.getItem('subdivisionInfo') || '{}')[id];
}

function updateSubdivisionInfo(id, updatedObj) {
    let currentValue = localStorage.getItem('subdivisionInfo');
    currentValue = JSON.parse(currentValue);
    currentValue[id] = updatedObj;

    localStorage.setItem('subdivisionInfo', JSON.stringify(currentValue));

    currentSubdivisionInfo = getSubdivisionInfo(subdivisionId);
}

// Logic Helpers -- Logic Helpers -- Logic Helpers -- Logic Helpers -- Logic Helpers -- Logic Helpers -- Logic Helpers -- Logic Helpers -- Logic Helpers

function getAutomationOptions() {
    return automationOptions[subdivisionType][selectedTab];
}

function setSalePrice(price) {
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
    // process products
    let tradeHall = {};
    let rows = document.querySelectorAll('form[name="tradingHallForm"] table.grid tbody tr:nth-child(n+4)');
    rows.forEach(row => {
        let title = row.querySelector('td:nth-child(3)').title;
        title = title.substr(0, title.indexOf('(') - 1).trim();
        let salesVolume = parseInt(row.querySelector('td:nth-child(4) > a').innerHTML.replace(" ", ""));
        let inStock = parseInt(row.querySelector('td:nth-child(6)').innerHTML.replace(" ", ""));

        tradeHall[title] = { salesVolume, inStock };
    });

    let currentSubdivisionInfo = getSubdivisionInfo(subdivisionId);
    currentSubdivisionInfo.tradeHall = tradeHall;

    updateSubdivisionInfo(subdivisionId, currentSubdivisionInfo);
}

function calculateStoreSupplyOrders() {
    // sanity check
    if (!currentSubdivisionInfo) {
        alert('No saved data found, update trade hall data first');
        return;
    }

    // process products
    let rows = document.querySelectorAll('table.list tbody tr:nth-child(n+5)[id^="product_row"]');
    rows.forEach(row => {
        let name = row.querySelector('th table tbody tr:first-child td img').alt.trim();
        let productInfo = currentSubdivisionInfo.tradeHall[name];
        let quantityInput = row.querySelector('td[id^="quantityField"] input');

        if (!productInfo)
            return;

        let orderAmount = productInfo.salesVolume * (1 + storeSupplySparesPercent) - productInfo.inStock;
        if (orderAmount > parseInt(quantityInput.value))
            row.querySelector('td[id^="quantityField"] input').value = orderAmount;
        else
            orderAmount = parseInt(quantityInput.value);

        productInfo.orderAmount = orderAmount;
    });

    updateSubdivisionInfo(subdivisionId, currentSubdivisionInfo);
}

function calculateWarehouseSupplyOrders() {

}

function addPriceQualityRatio() {
    let headerRowMarkerElement = document.querySelector('table[class^="unit-list"] > thead > tr > th:nth-child(5)');
    let headerRatio = createNewElement('th', { innerHTML: 'Ratio' });
    headerRowMarkerElement.after(headerRatio);

    let rows = document.querySelectorAll('table[class^="unit-list"] > tbody > tr[id^="r"]');

    rows.forEach(row => {
        let price = row.querySelector('td:nth-child(6)').innerText;
        console.log(price)
        price = parseFloat(price.substr(1, price.length - 1).replace(" ", ""));

        let quality = row.querySelector('td:nth-child(7)').innerHTML;
        quality = parseFloat(quality.replace(" ", ""));

        let ratio = parseFloat((quality / price).toFixed(3));

        let qualityElement = row.querySelector('td:nth-child(7)');

        let ratioElement = createNewElement('td', { innerHTML: ratio });
        qualityElement.after(ratioElement);
    });
}

// Main Logic -- Main Logic -- Main Logic -- Main Logic -- Main Logic -- Main Logic -- Main Logic -- Main Logic -- Main Logic -- Main Logic -- Main Logic

function addAutomationMenu() {
    let automationMenuOptions = getAutomationOptions()

    if (!automationMenuOptions)
        return;

    // create the automation menu
    automationMenu = addMenu('Automation', automationMenuOptions);
}

if (tabMenu) {
    addAutomationMenu();
}

if (window.location.href.match(/.*unit\/supply\/.*\/step2/)) {
    addPriceQualityRatio();
}