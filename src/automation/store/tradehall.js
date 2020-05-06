const storageUtils = require('../../utils/storageUtils');

function calculatePrices(maintenance) {
    if (maintenance) {
        let maintenanceObj = storageUtils.getMaintenance();
        if (maintenanceObj && maintenanceObj.doneMaintenance) {
            storageUtils.updateMaintenance({ ...maintenanceObj, ok: true });
            return true;
        }
    }





    if (maintenance)
        storageUtils.updateMaintenance({ doneMaintenance: true });

    // productTable.querySelector(':scope > tbody > tr:last-child > td > input[type="submit"][name="applyChanges"]').click();

    return !maintenance;
}

module.exports = {
    calculatePrices,
};