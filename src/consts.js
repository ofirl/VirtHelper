// Settings -- Settings -- Settings -- Settings -- Settings -- Settings -- Settings -- Settings -- Settings -- Settings -- Settings -- Settings -- Settings -- Settings
let overStockPercent = { // extra stock
    Store: 0.2,
    Restaurant: 0.2,
    Warehouse: 0.5,
};

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
    overStockPercent,
    storageItemKey,
    unitTypeMaintenancePages,
    unitMaintenanceOrder,
};