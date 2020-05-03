const consts = require('../../consts');

function calculateStoreSupplyOrders() {
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

    productTable.querySelector('input[type="submit"][name="applyChanges"]').click();
}

module.exports = {
    calculateStoreSupplyOrders,
};