const storageUtils = require('../../utils/storageUtils');
const virtUtils = require('../../utils/virtonomicsUtils');
const notificationUtils = require('../../utils/notificationsUtils');

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
        let productName = row.querySelector('th table tbody tr:first-child td img').alt.trim();
        let productInfo = {};
        ['amountInStock', 'quality', 'brand', 'primeCost', 'amountSold'].forEach((a, idx) => {
            productInfo[a] = virtUtils.parseVirtNum(
                row.querySelector(`:scope > td:nth-child(2) > table > tbody > tr:nth-child(${idx + 1}) > td:nth-child(2)`)
                    .innerText
            );
        });
        let { amountInStock, /*quality, brand, primeCost,*/ amountSold } = productInfo;

        let lastOrderedAmount = virtUtils.parseVirtNum(row.querySelector(':scope > td:nth-child(3)').innerText);
        let amountPurchased = virtUtils.parseVirtNum(row.querySelector(':scope > td:nth-child(4)').innerText);

        let quantityInput = row.querySelector('td[id^="quantityField"] input');

        if (lastOrderedAmount > amountPurchased)
            notificationUtils.addSupplyShortageNotification(productName);

        // no sales and no stock - new subdivision
        if (amountInStock === 0 && amountSold === 0) {
            notificationUtils.addNoSaleStockNotification(productName);
            return;
        }

        // no sales - if it's the second turn it's ok, otherwise it's bad
        if (amountSold === 0) {
            notificationUtils.addNoSaleNotification(productName);
            return;
        }

        virtUtils.setOrderAmount(amountSold, amountInStock, amountPurchased, quantityInput);
    });

    if (maintenance)
        storageUtils.updateMaintenance({ doneMaintenance: true });

    productTable.querySelector('input[type="submit"][name="applyChanges"]').click();

    return !maintenance;
}

module.exports = {
    calculateStoreSupplyOrders,
};