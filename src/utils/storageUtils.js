const consts = require('../consts');
const globals = require('../globals');

function updateStorage(obj) {
    let state = JSON.parse(localStorage.getItem(consts.storageItemKey));
    state = { ...state, ...obj };

    localStorage.setItem(consts.storageItemKey, JSON.stringify(state));
}

function getStorage() {
    return JSON.parse(localStorage.getItem(consts.storageItemKey));
}

function isMaintenanceMode(id) {
    id = id || globals.subdivisionId;

    let state = getStorage();
    return state.maintenanceMode && state.maintenanceMode[id] && state.maintenanceMode[id].ok == null;
}

function getMaintenance() {
    let state = getStorage();
    if (!state.maintenanceMode)
        return null;

    return state.maintenanceMode[globals.subdivisionId];
}

function updateMaintenance(maintenanceObj) {
    let state = getStorage();
    if (!state.maintenanceMode)
        return;

    state.maintenanceMode[globals.subdivisionId] = maintenanceObj;
    updateStorage(state);
}

function getSettingsObj() {
    return JSON.parse(localStorage.getItem(consts.settingsItemKey));
}

function updateSettingsObj(settingsObj) {
    settingsObj = { ...getSettingsObj(), ...settingsObj };
    localStorage.setItem(consts.settingsItemKey, JSON.stringify(settingsObj));
}

module.exports = {
    updateStorage,
    getStorage,
    isMaintenanceMode,
    getMaintenance,
    updateMaintenance,
    getSettingsObj,
    updateSettingsObj,
};