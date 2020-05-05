// Expert Settings -- Expert Settings -- Expert Settings -- Expert Settings -- Expert Settings -- Expert Settings -- Expert Settings -- Expert Settings -- Expert Settings
// Might break the script!!! Change only if you know what you are doing!!!
const unitMaintenanceOrder = ['Store', 'Gas station', 'Restaurant', 'Warehouse'];

// Consts -- Consts -- Consts -- Consts -- Consts -- Consts -- Consts -- Consts -- Consts -- Consts -- Consts -- Consts -- Consts -- Consts -- Consts -- Consts -- Consts
const storageItemKey = 'VirtHelper';
const settingsItemKey = 'VirtHelperSettings';
const unitTypeMaintenancePages = {
    Store: ['supply'],
    Restaurant: ['supply'],
    "Gas station": ['supply'],
    Warehouse: ['supply'],
};

const msgSeverity = {
    info: 'info',
    warning: 'warn',
    error: 'error',
};

module.exports = {
    // overStockPercent,
    // growStockPercent,
    unitMaintenanceOrder,
    storageItemKey,
    settingsItemKey,
    unitTypeMaintenancePages,
    msgSeverity,
};