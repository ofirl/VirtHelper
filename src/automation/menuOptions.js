const globals = require('../globals');
const enterpriseUnitList = require('./enterprise/unitList');
const storeSupply = require('./store/supply');
const warehouseSupply = require('./warehouse/supply');

function menuClick(func) {
    return (e) => {
        e.preventDefault();
        func();
        return false;
    };
}

let automationOptions = {
    Warehouse: {
        // sale: [
        //     {
        //         text: 'Set all prices',
        //         subMenu: 'price',
        //     }
        // ],
        supply: {
            maintenance: (arg) => {
                return warehouseSupply.calculateWarehouseSupplyOrders(arg);
            },
            options: [
                {
                    text: 'Calculate Orders',
                    func: menuClick(warehouseSupply.calculateWarehouseSupplyOrders)
                }
            ]
        },
    },
    Store: {
        // trading_hall: [
        //     {
        //         text: 'Update data',
        //         func: (e) => {
        //             e.preventDefault();
        //             updateTradeHallData();
        //             return false;
        //         }
        //     }
        // ],
        supply: {
            maintenance: (arg) => {
                return storeSupply.calculateStoreSupplyOrders(arg);
            },
            options: [
                {
                    text: 'Calculate Orders',
                    func: menuClick(storeSupply.calculateStoreSupplyOrders)
                }
            ]
        },
    },
    "Gas station": {
        supply: {
            maintenance: (arg) => {
                return storeSupply.calculateStoreSupplyOrders(arg);
            },
            options: [
                {
                    text: 'Calculate Orders',
                    func: menuClick(storeSupply.calculateStoreSupplyOrders)
                }
            ]
        },
    },
    Enterprise: {
        "unit_list": {
            options: [
                {
                    text: 'Maintenance',
                    func: menuClick(enterpriseUnitList.maintainUnits)
                }
            ]
        }
    }
};

function getAutomationOptions(maintenance = false) {
    let optionsObj = automationOptions[globals.subdivisionType];
    if (optionsObj)
        optionsObj = optionsObj[globals.selectedTab];
    if (!optionsObj)
        return null;

    if (maintenance)
        return optionsObj.maintenance;

    return optionsObj.options;
}

module.exports = {
    getAutomationOptions
}