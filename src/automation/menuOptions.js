const globals = require('../globals');
const storeSupply = require('./store/supply');
const enterpriseUnitList = require('./enterprise/unitList');

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
        // supply: [
        //     {
        //         text: 'Calculate orders',
        //         func: menuClick(calculateWarehouseSupplyOrders),
        //     }
        // ]
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
            maintenance: () => {

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
        "unit_list": [
            {
                text: 'Maintenance',
                func: menuClick(enterpriseUnitList.maintainUnits)
            }
        ]
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