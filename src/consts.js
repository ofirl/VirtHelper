// Settings -- Settings -- Settings -- Settings -- Settings -- Settings -- Settings -- Settings -- Settings -- Settings -- Settings -- Settings -- Settings -- Settings
let storeOverStockPercent = 0.2; // Store extra stock
let warehouseOverStockPercent = 0.5; // Warehouse extra stock

// Expert Settings -- Expert Settings -- Expert Settings -- Expert Settings -- Expert Settings -- Expert Settings -- Expert Settings -- Expert Settings -- Expert Settings
// Might break the script!!! Change only if you know what you are doing!!!
let unitMaintenanceOrder = ['Store', 'Warehouse'];

// Consts -- Consts -- Consts -- Consts -- Consts -- Consts -- Consts -- Consts -- Consts -- Consts -- Consts -- Consts -- Consts -- Consts -- Consts -- Consts -- Consts
let storageItemKey = 'VirtHelper';
let unitTypeMaintenancePages = {
    Store: ['supply'],
    "Gas station": ['supply'],
    Warehouse: ['supply'],
};

module.exports = {
    storeOverStockPercent,
    warehouseOverStockPercent,
    storageItemKey,
    unitTypeMaintenancePages,
    unitMaintenanceOrder,
};