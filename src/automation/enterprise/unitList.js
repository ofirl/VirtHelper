const consts = require('../../consts');
const settings = require('../../settings');
const storageUtils = require('../../utils/storageUtils');
const DOMUtils = require('../../utils/DOMUtils');

function startup() {
    maintenanceSettings();
}

function maintenanceSettings() {
    /** @type {Element} */
    let unitListTable = document.querySelector('table.unit_list_table');

    unitListTable.querySelector(':scope > thead > tr > th:last-child').after(
        DOMUtils.createNewElement('th', {
            innerText: 'Maint.',
            style: 'color: #0184d0;'
        })
    );

    let maintenanceDisabledUnits = settings.getSettings().maintenanceDisabled;

    let onMaintenanceEnabledChange = (id) => {
        let idx = maintenanceDisabledUnits.indexOf(id);
        if (idx !== -1)
            maintenanceDisabledUnits.splice(idx, 1);
        else
            maintenanceDisabledUnits.push(id);

        storageUtils.updateSettingsObj({ maintenanceDisabled: maintenanceDisabledUnits });
    }

    /** @type {NodeListOf<Element>} */
    let unitRows = unitListTable.querySelectorAll(':scope > tbody > tr');
    unitRows.forEach(row => {
        let unitId = row.getAttribute('data-id');
        row.querySelector('td:last-child').after(
            DOMUtils.createNewElement('td', {
                onclick: (e) => onMaintenanceEnabledChange(unitId),
                style: 'vertical-align: middle;',
                innerHTML: `<input type="checkbox"${maintenanceDisabledUnits.includes(unitId) ? "" : 'checked="true"'} />`
            })
        );
    });
}

function maintainUnits() {
    let maintenanceDisabledUnits = settings.getSettings().maintenanceDisabled;

    let maintenanceMode = {};
    let urls = [];

    let unitRows = document.querySelectorAll('table.unit_list_table > tbody > tr');
    unitRows.forEach(row => {
        let unitId = row.getAttribute('data-id');
        if (maintenanceDisabledUnits.includes(unitId))
            return;

        let unitLink = row.querySelector(':scope > td:nth-child(2) > a');
        let unitUrl = unitLink.href;
        let unitName = unitLink.innerText.trim();
        let unitType = unitLink.querySelector(':scope span').getAttribute('data-content').trim();

        maintenanceMode[unitId] = { ok: null, msg: null };
        urls.push({ unitId, unitName, url: unitUrl, unitType });
    });

    storageUtils.updateStorage({ maintenanceMode });

    // maintenance unit order - Stores, Warehouses
    let maintenanceSteps = consts.unitMaintenanceOrder.map(type => ({ type }));

    function runMaintenance() {
        for (let step of maintenanceSteps) {
            let { type: stepType } = step;

            if (step.done)
                continue;

            step.done = true;

            urls.filter(({ unitType }) => unitType === stepType).forEach(({ unitId, url, unitType }) => {
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
    startup,
    maintenanceSettings,
    maintainUnits,
}