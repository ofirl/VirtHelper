const globals = require('./globals');
const DOMUtils = require('./utils/DOMUtils');
const menuOptions = require('./automation/menuOptions');

console.log('VirtAutomation script running!');

function addPriceQualityRatio() {
    let headerRowMarkerElement = document.querySelector('table[class^="unit-list"] > thead > tr > th:nth-child(5)');
    let headerRatio = DOMUtils.createNewElement('th', { innerHTML: 'Ratio' });
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

        let ratioElement = DOMUtils.createNewElement('td', { innerHTML: ratio });
        qualityElement.after(ratioElement);
    });
}

function addAutomationMenu() {
    let automationMenuOptions = menuOptions.getAutomationOptions();

    if (!automationMenuOptions)
        return;

    // create the automation menu
    automationMenu = DOMUtils.addMenu('Automation', automationMenuOptions);
}

if (globals.tabMenu) {
    addAutomationMenu();
}
else if (window.location.href.match(/.*unit\/supply\/.*\/step2/)) {
    addPriceQualityRatio();
}