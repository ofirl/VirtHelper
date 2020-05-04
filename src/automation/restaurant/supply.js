const virtUtils = require('../../utils/virtonomicsUtils');

function calculateSupplyOrders(maintenance) {
    if (maintenance) {
        let maintenanceObj = storageUtils.getMaintenance();
        if (maintenanceObj && maintenanceObj.doneMaintenance) {
            storageUtils.updateMaintenance({ ...maintenanceObj, ok: true });
            return true;
        }
    }

    let productTable = document.querySelector('form[name="supplyContractForm"] > table.list');
    let productRows = productTable.querySelectorAll(':scope > tbody > tr:nth-child(n+3):nth-last-child(n + 2)')

    productRows.forEach(row => {
        let productName = row.querySelector(':scope > th > table > tbody > tr:nth-child(1) > td:nth-child(1) > a').innerText.trim();
        let consumptionPerClient = virtUtils.parseVirtNum(row.querySelector(':scope > td:nth-child(2) > table > tbody > tr:nth-child(1) > td:nth-child(2)').innerText);
        let amountConsumed = virtUtils.parseVirtNum(row.querySelector(':scope > td:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(2)').innerText);
        // let orderAmount = virtUtils.parseVirtNum(row.querySelector(':scope > td:nth-child(2) > table > tbody > tr:nth-child(3) > td:nth-child(2)').innerText);
        let amountPurchased = virtUtils.parseVirtNum(row.querySelector(':scope > td:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(2)').innerText);
        let amountInStock = virtUtils.parseVirtNum(row.querySelector(':scope > td:nth-child(3) > table > tbody > tr:nth-child(1) > td:nth-child(2)').innerText);
        let qualityInStock = virtUtils.parseVirtNum(row.querySelector(':scope > td:nth-child(3) > table > tbody > tr:nth-child(2) > td:nth-child(2)').innerText);
        let primeCost = virtUtils.parseVirtNum(row.querySelector(':scope > td:nth-child(3) > table > tbody > tr:nth-child(3) > td:nth-child(2)').innerText);

        let quantityInput = row.querySelector(':scope > td:nth-child(5) > input');

        // no sales and no stock - new subdivision
        if (amountInStock === 0 && amountConsumed === 0)
            return;

        // no sales - if it's the second turn it's ok, otherwise it's bad
        if (amountConsumed === 0)
            return;

        virtUtils.setOrderAmount(amountConsumed, amountInStock, quantityInput);
    });

    if (maintenance)
        storageUtils.updateMaintenance({ doneMaintenance: true });

    productTable.querySelector('input[type="submit"][name="applyChanges"]').click();

    return !maintenance;
}

module.exports = {
    calculateSupplyOrders,
};