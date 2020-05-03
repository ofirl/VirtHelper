const consts = require('../../consts');
const storageUtils = require('../../utils/storageUtils');

function maintainUnits() {
    let maintainUnits = {};
    let urls = [];

    let unitRows = document.querySelectorAll('table.unit_list_table > tbody > tr');
    unitRows.forEach(row => {
        let unitLink = row.querySelector(':scope > td:nth-child(2) > a');
        let unitUrl = unitLink.href;
        let unitId = unitUrl.match(/(\d{7})/)[0];
        let unitType = unitLink.querySelector(':scope span').getAttribute('data-content').trim();

        maintainUnits[unitId] = false;
        urls.push({ url: unitUrl, type: unitType });
    });

    storageUtils.updateStorage({ maintainUnits });
    urls.forEach(({ url, type }) => {
        console.log(url + "\n" + type);
        let pages = consts.unitTypeMaintenancePages[type];
        if (pages) {
            pages.forEach(p => {
                window.open(url + "/" + p, '_BLANK');
            });
        }
    });
}

module.exports = {
    maintainUnits,
}