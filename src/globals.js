const consts = require('./consts');

if (!localStorage.getItem(consts.storageItemKey))
    localStorage.setItem(consts.storageItemKey, '{}');

let tabMenu = document.querySelector('ul.tabu');

let subdivisionType = tabMenu ? tabMenu.querySelector('li:nth-child(2) > a') : null;
if (subdivisionType)
    subdivisionType = subdivisionType.innerHTML.trim();

let subdivisionId = window.location.href.match(/\d{7}/);
if (subdivisionId && subdivisionId.length)
    subdivisionId = subdivisionId[0];

let subdivisionName = document.querySelector('div.title > h1');
if (subdivisionName) {
    subdivisionName = subdivisionName.innerText.split(' ');
    subdivisionName.pop();
    subdivisionName = subdivisionName.join(' ');
}

let selectedTab = tabMenu ? tabMenu.querySelector('li.sel a') : null;
if (selectedTab)
    selectedTab = selectedTab.getAttribute('data-name').match(/(?:--?([^-]*))/g).pop().replace(/-/g, "");

let selectedTabElement = tabMenu ? tabMenu.querySelector('li.sel a') : null;
if (selectedTab === "unit_list" && selectedTabElement && selectedTabElement.innerText === "My business")
    subdivisionType = "Enterprise";

let automationMenu;
let currentOpenSubMenus = [];

module.exports = {
    tabMenu,
    subdivisionType,
    subdivisionId,
    subdivisionName,
    selectedTab,
    automationMenu,
    currentOpenSubMenus,
}