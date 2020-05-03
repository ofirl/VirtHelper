const globals = require('../globals');

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
    let newMenu = createNewElement('li', { classList: "sub", onmouseenter: menuMouseOver, onmouseout: menuMouseOut }, globals.tabMenu);
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

module.exports = {
    createNewElement,
    getSelectedTab,
    openSubMenu,
    closeSubMenu,
    addClass,
    removeClass,
    addMenu,
}