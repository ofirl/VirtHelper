const consts = require('../consts');
const globals = require('../globals');
const settings = require('../settings');

function parseVirtNum(virtNum) {
    if (virtNum == null)
        return null;

    return parseFloat(virtNum.replace(/ |\$/g, ""));
}

function setOrderAmount(usedLastTurn, inStock, purchased, quantityInput) {
    let orderAmount;
    if (inStock === purchased) {
        let soldOutGrowPercent = settings.getSettings().growStockPercent[globals.subdivisionType] || 0;
        orderAmount = Math.ceil(purchased * (1 + soldOutGrowPercent));
    }
    else {
        let overStockPercent = settings.getSettings().overStockPercent[globals.subdivisionType] || 0;
        orderAmount = Math.ceil(usedLastTurn * (1 + overStockPercent) - (inStock - usedLastTurn));
        if (orderAmount < 0)
            orderAmount = 0;
    }

    quantityInput.value = orderAmount;

    return orderAmount;
}

function calcSalary(sn, sc, kn, kc, kr) {
    // s = salary, k = skill, n = now, c = city, r = required
    var calc = sn > sc ? kn - kc * Math.log(1 + sn / sc) / Math.log(2) : Math.pow(sc / sn, 2) * kn - kc;
    return kr > (calc + kc) ? sc * (Math.pow(2, (kr - calc) / kc) - 1) : sc * Math.sqrt(kr / (kc + calc));
}

function calcEmployees(skill, factor, manager) {
    return Math.pow(5, 1 + skill) * Math.pow(7, 1 - skill) * factor * Math.pow(manager, 2);
}

function calcSkill(employees, factor, manager) {
    return -Math.log(employees / (35 * factor * Math.pow(manager, 2))) / Math.log(7 / 5);
}

function calcEquip(skill) {
    return Math.pow(skill, 1.5);
}

function calcTechLevel(manager) {
    return Math.pow(manager * 156.25, 1 / 3);
}

function calcTopTech(tech) {
    return Math.pow(tech, 3) / 156.25;
}

function calcAllEmployees(factor, manager) {
    return 25 * factor * manager * (manager + 3);
}

function calcTop1(empl, qual, factor) {
    return Math.pow(5, 1 / 2 * (-1 - qual)) * Math.pow(7, 1 / 2 * (-1 + qual)) * Math.sqrt(empl / factor);
}

function calcTop3(empl, factor) {
    return (-15 * factor + Math.sqrt(225 * factor * factor + 4 * factor * empl)) / (10 * factor);
}

function calcEfficiency(employees, allEmployees, manager, factor1, factor3, qualification, techLevel) {

    var effi = [];
    effi[0] = 100;
    effi[1] = manager / calcTop1(employees, qualification, factor1) * calcAllEmployees(factor3, manager) / allEmployees * 100;
    effi[2] = manager / calcTop1(employees, qualification, factor1) * 6 / 5 * 100;
    effi[3] = calcAllEmployees(factor3, manager) / allEmployees * 6 / 5 * 100;
    effi[4] = manager / calcTopTech(techLevel) * calcAllEmployees(factor3, manager) / allEmployees * 100;
    effi[5] = manager / calcTopTech(techLevel) * 6 / 5 * 100;

    console.log(effi);
    return (Math.round(Math.min.apply(null, effi) * 10) / 10).toFixed(2) + "%";

}

function calcOverflowTop1(allEmployees, factor3, manager) {
    console.log(calcAllEmployees(factor3, manager) / allEmployees);
    return Math.max(Math.min(6 / 5, calcAllEmployees(factor3, manager) / allEmployees), 5 / 6);
}

function calcOverflowTop3(employees, qualification, techLevel, factor1, manager) {
    console.log(manager / calcTopTech(techLevel), manager / calcTop1(employees, qualification, factor1));
    return Math.max(Math.min(6 / 5, manager / calcTopTech(techLevel), manager / calcTop1(employees, qualification, factor1)), 5 / 6);
}

function calcBaseRetailPrice(myQuality, localPrice, localQuality) {
    return Math.max(localPrice * (1 + Math.log(myQuality / localQuality)), 0);
}

function calcBaseRetailPrice2(myQuality, localPrice, localQuality) {
    if (myQuality - 30 > localQuality) {
        return 2.5 * localPrice;
    } else if (myQuality - 20 > localQuality) {
        return 2 * localPrice;
    } else if (myQuality - 10 > localQuality) {
        return 1.5 * localPrice;
    } else {
        return localPrice;
    }
}

module.exports = {
    parseVirtNum,
    setOrderAmount,
};