const consts = require('./consts');
const storageUtils = require('./utils/storageUtils');
const DOMUtils = require('./utils/DOMUtils');

if (!localStorage.getItem(consts.settingsItemKey))
    localStorage.setItem(consts.settingsItemKey, '{}');

/**
 * @typedef {{
 * Store: number,
 * "Gas station": number,
 * Restaurant: number,
 * Warehouse: number,
 * }} overStockPercent
 */
let overStockPercent = { // extra stock
    Store: 0.2,
    "Gas station": 0.2,
    Restaurant: 0.2,
    Warehouse: 1,
};

/**
 * @typedef {{
    * Store: number,
    * "Gas station": number,
    * Restaurant: number,
    * Warehouse: number,
    * }} growStockPercent
    */
let growStockPercent = { // sold out grow
    Store: 0.5,
    "Gas station": 0.5,
    Restaurant: 0.5,
    Warehouse: 1,
};

/**
 * @typedef {object} SettingsObj
 * @property {overStockPercent} overStockPercent
 * @property {growStockPercent} growStockPercent
 * @property {string[]} maintenanceDisabled
 * 
 * @returns {SettingsObj}
 */
function getDefaultSettings() {
    return {
        overStockPercent,
        growStockPercent,
        maintenanceDisabled: [],
    };
}

/**
 * @returns {SettingsObj}
 */
function getSettings() {
    return { ...getDefaultSettings(), ...storageUtils.getSettingsObj() };
}

function openSettingsPopup() {
    //TODO: implement settings onChanged - need to change in storage
    let currentSettings = getSettings();

    let mainContent = document.querySelector('div#mainContent');
    mainContent.appendChild(<div className="metroinc_wrapper modal fade bs-modal-lg in" role="dialog" style="z-index: 1040; display: block; padding-right: 17px;" id="settings-modal">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" onclick="document.querySelector('#settings-modal').remove();" />
                    <h1>
                        <i class="fa fa-cog" alt="Settings" title="Settings" />
                        Settings
                    </h1>
                </div>
                <div class="modal-body">
                    <div class="tabbable-custom">
                        <ul class="nav nav-tabs">
                            <li class="active">
                                <a data-toggle="tab" href="#settings-modal-general">
                                    General
                                </a>
                            </li>
                            <li class="">
                                <a data-toggle="tab" href="#settings-modal-advanced">
                                    Advanced
                                </a>
                            </li>
                        </ul>
                        <div class="tab-content">
                            <div class="tab-pane active" id="settings-modal-general">
                                <div class="flex-container flex-2cols">
                                    <div class="flex-item">
                                        <h4>Over stock percentage:</h4>
                                        <ul class="list-group vir-list-group-strypes mt-compact">
                                            {DOMUtils.createSettingsInputSlider('li', 'Warehouse', 'overStock', 0, 10, 0.1, currentSettings.overStockPercent.Warehouse)}
                                            {DOMUtils.createSettingsInputSlider('li', 'Restaurant', 'overStock', 0, 3, 0.1, currentSettings.overStockPercent.Restaurant)}
                                        </ul>
                                    </div>
                                    <div class="flex-item">
                                        <h4>&nbsp;</h4>
                                        <ul class="list-group vir-list-group-strypes mt-compact">
                                            {DOMUtils.createSettingsInputSlider('li', 'Store', 'overStock', 0, 3, 0.1, currentSettings.overStockPercent.Store)}
                                            {DOMUtils.createSettingsInputSlider('li', 'Gas station', 'overStock', 0, 3, 0.1, currentSettings.overStockPercent["Gas station"])}
                                        </ul>
                                    </div>
                                </div>
                                <div class="flex-container flex-2cols">
                                    <div class="flex-item">
                                        <h4>Sold out grow percentage:</h4>
                                        <ul class="list-group vir-list-group-strypes mt-compact">
                                            {DOMUtils.createSettingsInputSlider('li', 'Warehouse', 'grow', 0, 3, 0.1, currentSettings.growStockPercent.Warehouse)}
                                            {DOMUtils.createSettingsInputSlider('li', 'Restaurant', 'grow', 0, 1, 0.1, currentSettings.growStockPercent.Restaurant)}
                                        </ul>
                                    </div>
                                    <div class="flex-item">
                                        <h4>&nbsp;</h4>
                                        <ul class="list-group vir-list-group-strypes mt-compact">
                                            {DOMUtils.createSettingsInputSlider('li', 'Store', 'grow', 0, 1, 0.1, currentSettings.growStockPercent.Store)}
                                            {DOMUtils.createSettingsInputSlider('li', 'Gas station', 'grow', 0, 1, 0.1, currentSettings.growStockPercent["Gas station"])}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="tab-pane" id="settings-modal-advanced">
                                advanced
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>);
}

module.exports = {
    overStockPercent,
    growStockPercent,
    getSettings,
    openSettingsPopup,
};