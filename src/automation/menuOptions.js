const globals = require('../globals');
const enterpriseUnitList = require('./enterprise/unitList');
const storeSupply = require('./store/supply');
const storeTradehall = require('./store/tradehall');
const restaurantSupply = require('./restaurant/supply');
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
        trading_hall: {
            maintenance: (arg) => {
                return storeTradehall.calculatePrices(arg);
            },
            options: [
                {
                    text: 'Calculate Prices',
                    func: menuClick(storeTradehall.calculatePrices),
                }
            ],
        },
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
    Restaurant: {
        supply: {
            maintenance: (arg) => {
                return restaurantSupply.calculateSupplyOrders(arg);
            },
            options: [
                {
                    text: 'Calculate Orders',
                    func: menuClick(restaurantSupply.calculateSupplyOrders)
                }
            ]
        },
    },
    Enterprise: {
        "unit_list": {
            startup: enterpriseUnitList.startup,
            options: [
                {
                    text: 'Run unit maintenance',
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

    optionsObj.startup && optionsObj.startup();

    if (maintenance)
        return optionsObj.maintenance;

    return optionsObj.options;
}

module.exports = {
    getAutomationOptions
}