const consts = require('../consts');
const globals = require('../globals');

function parseVirtNum(virtNum) {
    if (virtNum == null)
        return null;

    return parseFloat(virtNum.replace(/ |\$/g, ""));
}

function setOrderAmount(usedLastTurn, inStock, quantityInput) {
    let overStockPercent = consts.overStockPercent[globals.subdivisionType] || 0;
    let orderAmount = Math.ceil(usedLastTurn * (1 + overStockPercent) - (inStock - usedLastTurn));
    if (orderAmount < 0)
        orderAmount = 0;

    quantityInput.value = orderAmount;

    return orderAmount;
}

module.exports = {
    parseVirtNum,
    setOrderAmount,
};