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

// function openSubMenu(subMenu) {
//     subMenu = subMenus[subMenu];
//     if (currentOpenSubMenus.find((m) => m.name === subMenu.title))
//         return false;

//     let newMenu = addMenu(subMenu.title, subMenu.options);
//     currentOpenSubMenus.push({ name: subMenu.title, element: newMenu });

//     return false;
// }

// function closeSubMenu(subMenuName) {
//     let menuIndex = currentOpenSubMenus.findIndex((m) => m.name === subMenuName);
//     let menusToClose = currentOpenSubMenus.splice(menuIndex, currentOpenSubMenus.length - menuIndex);

//     menusToClose.forEach(menu => {
//         menu.element.remove();
//     });
// }

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
            onclick: option.func,
        }, menuItem);
    });


    return newMenu;
}

function onInputSliderChange(e, otherElement) {
    let newValue = parseFloat(e.target.value);
    if (isNaN(newValue))
        e.target.value = otherElement.value;
    else
        otherElement.value = newValue;
}

/**
 * @param {string} tag 
 * @param {string} label 
 * @param {string} category 
 * @param {number} sliderMin 
 * @param {number} sliderMax 
 * @param {number} sliderStep 
 * @param {number} sliderValue 
 */
function createSettingsInputSlider(tag, label, category, sliderMin = 0, sliderMax = 10, sliderStep = 0.1, sliderValue = 5) {
    // `Store
    // <input type="text" id="store-over-stock-input" class="form-control input-xsmall pull-right mono" value="0.2">
    // <input type="range" id="store-over-stock-range" class="" min="0" max="10" step="0.1" value="0.2">`
    let inputSlider = createNewElement(tag, { innerText: label, class: "list-group-item" });

    let input;
    let slider;

    input = createNewElement('input', {
        type: 'text',
        id: `${label.toLowerCase().replace(" ", "")}-${category.toLowerCase()}-input`,
        classList: 'form-control input-xsmall pull-right mono',
        defaultValue: sliderValue,
        onchange: (e) => onInputSliderChange(e, slider),
    }, inputSlider);

    slider = createNewElement('input', {
        type: 'range',
        id: `${label.toLowerCase().replace(" ", "")}-${category.toLowerCase()}-range`,
        min: sliderMin,
        max: sliderMax,
        step: sliderStep,
        defaultValue: sliderValue,
        onchange: (e) => onInputSliderChange(e, input),
    }, inputSlider);

    // setTimeout(input.addEventListener('change', (e) => onInputSliderChange(e, slider)), 1000);

    return inputSlider;
}

module.exports = {
    createNewElement,
    getSelectedTab,
    // openSubMenu,
    // closeSubMenu,
    addClass,
    removeClass,
    addMenu,
    createSettingsInputSlider,
};