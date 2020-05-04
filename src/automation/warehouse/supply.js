const consts = require('../../consts');
const globals = require('../../globals');
const virtUtils = require('../../utils/virtonomicsUtils');

function calculateWarehouseSupplyOrders(maintenance = false) {
    if (maintenance) {
        let maintenanceObj = storageUtils.getMaintenance();
        if (maintenanceObj && maintenanceObj.doneMaintenance) {
            storageUtils.updateMaintenance({ ...maintenanceObj, ok: true });
            return true;
        }
    }

    let productTable = document.querySelector('form[name="supplyContractForm"] > table.list');
    let productRowsTitle = productTable.querySelectorAll(':scope > tbody > tr.p_title');

    let errors = [];

    productRowsTitle.forEach(row => {
        // console.log(row);
        let productName = row.querySelector(':scope > td:nth-child(1) > div > div > strong').innerText.trim();
        let amountInStock = virtUtils.parseVirtNum(
            row.querySelector(':scope > td:nth-child(1) > div:nth-child(2) > table > tbody > tr:nth-child(1) > td:nth-child(2) > strong')
                .innerText
        );
        let qualityPrimeCostArr = row.querySelector(':scope > td:nth-child(1) > div:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(2) > strong').innerText
            .trim().split("/");
        let qualityInStock = virtUtils.parseVirtNum(qualityPrimeCostArr[0]);
        let primeCost = virtUtils.parseVirtNum(qualityPrimeCostArr[1]);
        let contractsOrdersAmount = virtUtils.parseVirtNum(
            (row.querySelector(':scope > td:nth-child(1) > div:nth-child(2) > table > tbody > tr:nth-child(3) > td:nth-child(2) > strong') || {})
                .innerText
        );
        // let orderAmount = virtUtils.parseVirtNum(row.querySelector(':scope > td:nth-child(2) > nobr > strong').innerText);
        let amountPurchased = virtUtils.parseVirtNum(row.querySelector(':scope > td:nth-child(3) > nobr > strong').innerText);
        let purchasedPrice = virtUtils.parseVirtNum(row.querySelector(':scope > td:nth-child(4) > nobr > strong').innerText);
        let purchasedQuality = virtUtils.parseVirtNum(row.querySelector(':scope > td:nth-child(6) > nobr > strong').innerText);
        let purchasedCost = virtUtils.parseVirtNum(row.querySelector(':scope > td:nth-child(8) > nobr > strong').innerText);

        // console.log(row);
        let orderRow = row.nextElementSibling;
        let orderAmountInput = orderRow.querySelector('td:nth-child(2) > input');
        let problem = orderRow.querySelector('td:nth-child(9) > span').style['color'] === "red";

        if (problem)
            errors.push(`Possible problem at <a href="${window.location.href}">${globals.subdivisionName}</a> with the product ${productName}`);

        virtUtils.setOrderAmount(contractsOrdersAmount, amountInStock, orderAmountInput);
    });

    if (maintenance)
        storageUtils.updateMaintenance({ doneMaintenance: true, msg: errors.length ? errors : null });

    productTable.querySelector(':scope > tbody > tr:last-child > td > input[type="submit"][name="applyChanges"]').click();

    return !maintenance;
};

module.exports = {
    calculateWarehouseSupplyOrders,
};