const consts = require('../../consts');
const storageUtils = require('../../utils/storageUtils');

function calculateStoreSupplyOrders(maintenance = false) {
    if (maintenance && storageUtils.getMaintenance()) {
        storageUtils.updateMaintenance({ ok: true });
        return;
    }

    // process products
    let productTable = document.querySelectorAll('table.list');
    let rows = productTable.querySelectorAll('tbody tr:nth-child(n+5)[id^="product_row"]');
    rows.forEach(row => {
        let name = row.querySelector('th table tbody tr:first-child td img').alt.trim();
        // let productInfo = currentSubdivisionInfo.tradeHall[name];
        console.log(name);
        let productInfo = {};
        ['amountInStock', 'quality', 'brand', 'primeCost', 'amountSold'].forEach((a, idx) => {
            productInfo[a] = parseFloat(row.querySelector(`:scope > td:nth-child(2) > table > tbody > tr:nth-child(${idx + 1}) > td:nth-child(2)`)
                .innerText.replace(" ", "").replace("$", ""));
        });
        console.log(productInfo);
        let quantityInput = row.querySelector('td[id^="quantityField"] input');

        let orderAmount = productInfo.amountSold * (1 + consts.storeOverStockPercent) - (productInfo.amountInStock - productInfo.amountSold);
        if (orderAmount < 0)
            orderAmount = 0;

        quantityInput.value = orderAmount;
    });

    if (maintenance)
        storageUtils.updateMaintenance({ doneMaintenance: true });

    productTable.querySelector('input[type="submit"][name="applyChanges"]').click();
    return !maintenance;
}

module.exports = {
    calculateStoreSupplyOrders,
};