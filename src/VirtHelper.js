const globals = require('./globals');
const DOMUtils = require('./utils/DOMUtils');
const menuOptions = require('./automation/menuOptions');
const storageUtils = require('./utils/storageUtils');
const virtUtils = require('./utils/virtonomicsUtils');

console.log('VirtAutomation script running!');

function addPriceQualityRatio() {
    let headerRowTitles = [];
    document.querySelectorAll('table[class^="unit-list"] > thead > tr > th > div:nth-child(1)')
        .forEach(title => headerRowTitles.push(title.innerText.trim()));

    let priceCol = headerRowTitles.indexOf('Price');
    let qualityCol = headerRowTitles.indexOf('Quality');

    if (!priceCol || !qualityCol)
        return;

    let headerRowQualityTitle = document.querySelector(`table[class^="unit-list"] > thead > tr > th:nth-child(${qualityCol + 1})`);
    let headerRatioTitle = DOMUtils.createNewElement('th', { innerHTML: 'Ratio' });
    headerRowQualityTitle.after(headerRatioTitle);

    let rows = document.querySelectorAll('table[class^="unit-list"] > tbody > tr[id^="r"]');

    rows.forEach(row => {
        let price = virtUtils.parseVirtNum(row.querySelector(`td:nth-child(${priceCol + 3})`).innerText);
        let qualityElement = row.querySelector(`td:nth-child(${qualityCol + 3})`);
        quality = virtUtils.parseVirtNum(qualityElement.innerText);

        let ratio = parseFloat((quality / price).toFixed(3));

        let ratioElement = DOMUtils.createNewElement('td', { innerHTML: ratio, style: "width: 90px; text-align:right;" });
        qualityElement.after(ratioElement);
    });

    setTimeout(() => {
        document.querySelectorAll('table[class^="unit-list"] > tbody > tr.ordered > td:nth-child(1)').forEach(r => { r.colSpan = "10" });
    }, 1);
}

function addAutomationMenu() {
    let automationMenuOptions = menuOptions.getAutomationOptions();

    if (!automationMenuOptions)
        return;

    // create the automation menu
    automationMenu = DOMUtils.addMenu('Automation', automationMenuOptions);
}

if (storageUtils.isMaintenanceMode()) {
    let maintenanceFunc = menuOptions.getAutomationOptions(true);
    if (maintenanceFunc && maintenanceFunc(true))
        window.close();
}
else {
    if (globals.tabMenu) {
        addAutomationMenu();
    }
    else if (window.location.href.match(/.*unit\/supply\/.*\/step2/)) {
        addPriceQualityRatio();
    }
}