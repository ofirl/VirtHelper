const consts = require('../consts');
const globals = require('../globals');
const storageUtils = require('./storageUtils');

function addNoSaleStockNotification(productName) {
    storageUtils.addMessage({
        severity: consts.msgSeverity.warning,
        text: `No sales and stock of ${productName} at <a href="${window.location.href}"> ${globals.subdivisionName} </a>\nPossibly new subdivision, if so, ignore this message`
    });
}

function addNoSaleNotification(productName) {
    storageUtils.addMessage({
        severity: consts.msgSeverity.warning,
        text: `No sales of ${productName} at <a href="${window.location.href}"> ${globals.subdivisionName} </a>\nPossibly new subdivision, if so, ignore this message`
    });
}

function addSupplyShortageNotification(productName) {
    storageUtils.addMessage({
        severity: consts.msgSeverity.error,
        text: `Supply shortage of ${productName} at <a href="${window.location.href}"> ${globals.subdivisionName} </a>`
    });
}

function addsupplierLowStockNotification(productName) {
    storageUtils.addMessage({
        severity: consts.msgSeverity.error,
        text: `Supplier has low stock of ${productName} at <a href="${window.location.href}"> ${globals.subdivisionName} </a>`
    });
}

module.exports = {
    addNoSaleStockNotification,
    addNoSaleNotification,
    addSupplyShortageNotification,
    addsupplierLowStockNotification,
};