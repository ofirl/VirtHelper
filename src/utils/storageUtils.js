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

/**
 * @param {string} id subdivision id
 */
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

/**
 * @returns {SettingsObj}
 */
function getSettingsObj() {
    return JSON.parse(localStorage.getItem(consts.settingsItemKey));
}

function updateSettingsObj(settingsObj) {
    settingsObj = { ...getSettingsObj(), ...settingsObj };
    localStorage.setItem(consts.settingsItemKey, JSON.stringify(settingsObj));
}

/**
 * @returns {MessageObj[]}
 */
function getMessages() {
    return getStorage().msgs || [];
}

/**
 * @typedef {object} MessageObj
 * @property {string} severity
 * @property {string} text
 */
/**
 * @param {MessageObj} msg 
 */
function addMessage(msg) {
    let msgs = getMessages();
    msgs.push(msg);

    updateStorage({ msgs });
}

function removeMsg(msgIdx) {
    let msgs = getMessages();
    msgs.splice(msgIdx, 1);

    updateStorage({ msgs });
}

function getPolicy() {
    return getSettingsObj().policies[globals.subdivisionId];
}

function updatePolicy(policyObj) {
    let currentSettings = getSettingsObj();
    currentSettings.policies[globals.subdivisionId] = policyObj;

    updateSettingsObj(currentSettings);
}

module.exports = {
    updateStorage,
    getStorage,
    isMaintenanceMode,
    getMaintenance,
    updateMaintenance,
    getSettingsObj,
    updateSettingsObj,
    getMessages,
    addMessage,
    removeMsg,
    getPolicy,
    updatePolicy,
};