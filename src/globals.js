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

let selectedTab = tabMenu ? tabMenu.querySelector('li.sel a') : null;
if (selectedTab)
    selectedTab = selectedTab.getAttribute('data-name').match(/--(.*)/)[1];

if (selectedTab === "unit_list")
    subdivisionType = "Enterprise";

let automationMenu;
let currentOpenSubMenus = [];

module.exports = {
    tabMenu,
    subdivisionType,
    subdivisionId,
    selectedTab,
    automationMenu,
    currentOpenSubMenus,
}