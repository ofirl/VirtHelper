const consts = require('../consts');

function updateStorage(obj) {
    let state = JSON.parse(localStorage.getItem(consts.storageItemKey));
    state = { ...state, ...obj };

    localStorage.setItem(consts.storageItemKey, JSON.stringify(state));
}

module.exports = {
    updateStorage,
};