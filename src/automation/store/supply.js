const consts = require('../../consts');
const storageUtils = require('../../utils/storageUtils');
const virtUtils = require('../../utils/virtonomicsUtils');

function calculateStoreSupplyOrders(maintenance = false) {
    if (maintenance) {
        let maintenanceObj = storageUtils.getMaintenance();
        if (maintenanceObj && maintenanceObj.doneMaintenance) {
            storageUtils.updateMaintenance({ ...maintenanceObj, ok: true });
            return true;
        }
    }

    // process products
    let productTable = document.querySelector('table.list');
    let rows = productTable.querySelectorAll('tbody tr:nth-child(n+5)[id^="product_row"]');

    rows.forEach(row => {
        let name = row.querySelector('th table tbody tr:first-child td img').alt.trim();
        let productInfo = {};
        ['amountInStock', 'quality', 'brand', 'primeCost', 'amountSold'].forEach((a, idx) => {
            productInfo[a] = virtUtils.parseVirtNum(
                row.querySelector(`:scope > td:nth-child(2) > table > tbody > tr:nth-child(${idx + 1}) > td:nth-child(2)`)
                    .innerText
            );
        });

        let quantityInput = row.querySelector('td[id^="quantityField"] input');

        // no sales and no stock - new subdivision
        if (productInfo.amountInStock === 0 && productInfo.amountSold === 0)
            return;

        // no sales - if it's the second turn it's ok, otherwise it's bad
        if (productInfo.amountSold === 0)
            return;

        virtUtils.setOrderAmount(productInfo.amountSold, productInfo.amountInStock, quantityInput);
    });

    if (maintenance)
        storageUtils.updateMaintenance({ doneMaintenance: true });

    productTable.querySelector('input[type="submit"][name="applyChanges"]').click();

    return !maintenance;
}

module.exports = {
    calculateStoreSupplyOrders,
};