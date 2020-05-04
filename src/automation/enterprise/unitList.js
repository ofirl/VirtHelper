const consts = require('../../consts');
const storageUtils = require('../../utils/storageUtils');

function maintainUnits() {
    let maintenanceMode = {};
    let urls = [];

    let unitRows = document.querySelectorAll('table.unit_list_table > tbody > tr');
    unitRows.forEach(row => {
        let unitLink = row.querySelector(':scope > td:nth-child(2) > a');
        let unitUrl = unitLink.href;
        let unitName = unitLink.innerText.trim();
        let unitId = unitUrl.match(/(\d{7})/)[0];
        let unitType = unitLink.querySelector(':scope span').getAttribute('data-content').trim();

        maintenanceMode[unitId] = { ok: null, msg: null };
        urls.push({ id: unitId, name: unitName, url: unitUrl, type: unitType });
    });

    storageUtils.updateStorage({ maintenanceMode });

    // maintenance unit order - Stores, Warehouses
    let maintenanceSteps = consts.unitMaintenanceOrder.map(type => { type });

    function runMaintenance() {
        for (let step of maintenanceSteps) {
            let { type: stepType } = step;

            if (step.done)
                continue;

            step.done = true;

            urls.filter(({ type: unitType }) => unitType === stepType).forEach(({ id: unitId, url, type: unitType }) => {
                if (!storageUtils.isMaintenanceMode(unitId))
                    return;

                step.done = false;

                let pages = consts.unitTypeMaintenancePages[unitType];
                if (pages) {
                    pages.forEach(p => {
                        window.open(url + "/" + p, '_BLANK');
                    });
                }
            });

            if (!step.done) {
                setTimeout(runMaintenance, 5000);
                return;
            }
        }

        // maintenance is done
        storageUtils.updateStorage({ maintenanceMode: null });
        //TODO: remove running icon
    }

    //TODO: set running icon

    runMaintenance();
}

module.exports = {
    maintainUnits,
}