const storageUtils = require('../../utils/storageUtils');
const virtUtils = require('../../utils/virtonomicsUtils');
const consts = require('../../consts');

function calculatePrices(maintenance) {
    if (maintenance) {
        let maintenanceObj = storageUtils.getMaintenance();
        if (maintenanceObj && maintenanceObj.doneMaintenance) {
            storageUtils.updateMaintenance({ ...maintenanceObj, ok: true });
            return true;
        }
    }

    let productRows = document.querySelectorAll('form[name="tradingHallForm"] > table:nth-child(2) > tbody > tr:nth-child(n+4)');
    productRows.forEach(row => {
        // let productName = row.querySelector('td:nth-child(3)').title.match(/(.*) \(click to view marketing report\)/)[1];
        // let purchasingPrice = virtUtils.parseVirtNum(row.querySelector('td:nth-child(9)').innerText);
        let priceInput = row.querySelector('td:nth-child(10) > input');
        let marketShare = virtUtils.parseVirtNum(row.querySelector('td:nth-child(11)').innerText);
        let currentPrice = virtUtils.parseVirtNum(priceInput.value);

        let desiredMarketShare = 10;
        let changePercent = 3 / 100;

        virtUtils.setPrices(currentPrice, marketShare, priceInput, desiredMarketShare, changePercent);
    });

    if (maintenance)
        storageUtils.updateMaintenance({ doneMaintenance: true });

    document.querySelector('form[name="tradingHallForm"] input[type="submit"][name="setprice"]').click();

    return !maintenance;
}

module.exports = {
    calculatePrices,
};