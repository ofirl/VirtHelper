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
    Warehouse: 0.5,
};

/**
 * @typedef {object} SettingsObj
 * @property {overStockPercent} overStockPercent
 * @property {string[]} maintenanceDisabled
 * 
 * @returns {SettingsObj}
 */
function getDefaultSettings() {
    return {
        overStockPercent,
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
    let currentSettings = getSettings();

    let mainContent = document.querySelector('div#mainContent');
    mainContent.appendChild(<div className="modal fade bs-modal-lg in" role="dialog" style="z-index: 1040; display: block; padding-right: 17px;" id="settings-modal">
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
                                            {DOMUtils.createSettingsInputSlider('li', 'Store', 'overStock', 0, 10, 0.1, currentSettings.overStockPercent.Store)}
                                            <li class="list-group-item">
                                                Restaurant
                                        <input type="text" id="restaurant-over-stock-input" class="form-control input-xsmall pull-right mono" value="0.2" />
                                                <input type="range" id="restaurant-over-stock-range" class="" min="0" max="10" step="0.1" value="0.2" />
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="flex-item">
                                        <h4>&nbsp;</h4>
                                        <ul class="list-group vir-list-group-strypes mt-compact">
                                            <li class="list-group-item">
                                                Warehouse
                                        <input type="text" id="warehouse-over-stock-input" class="form-control input-xsmall pull-right mono" value="0.2" />
                                                <input type="range" id="warehouse-over-stock-range" class="" min="0" max="10" step="0.1" value="0.2" />
                                            </li>
                                            <li class="list-group-item">
                                                Gas station
                                        <input type="text" id="gas-station-over-stock-input" class="form-control input-xsmall pull-right mono" value="0.2" />
                                                <input type="range" id="gas-station-over-stock-range" class="" min="0" max="10" step="0.1" value="0.2" />
                                            </li>
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
    // mainContent.innerHTML += `
    //     <div class="modal fade bs-modal-lg in" role="dialog" style="z-index: 1040; display: block; padding-right: 17px;" id="settings-modal">
    //         <div class="modal-dialog modal-lg" role="document">
    //             <div class="modal-content">
    //                 <div class="modal-header">
    //                     <button type="button" class="close" data-dismiss="modal" onclick="document.querySelector('#settings-modal').remove();"></button>
    //                     <h1>
    //                         <i class="fa fa-cog" alt="Settings" title="Settings"></i>
    //                         Settings
    //                     </h1>		
    //                 </div>
    //                 <div class="modal-body">
    //                     <div class="tabbable-custom">
    //                         <ul class="nav nav-tabs">
    //                             <li class="active">
    //                                 <a data-toggle="tab" href="#settings-modal-general">
    //                                     General
    //                                 </a>
    //                             </li>
    //                             <li class="">
    //                                 <a data-toggle="tab" href="#settings-modal-advanced">
    //                                     Advanced
    //                                 </a>
    //                             </li>
    //                         </ul>
    //                         <div class="tab-content">
    //                             <div class="tab-pane active" id="settings-modal-general">





    //                             <div class="flex-container flex-2cols">
    //                                 <div class="flex-item">
    //                                     <h4>Over stock percentage:</h4>
    //                                     <ul class="list-group vir-list-group-strypes mt-compact">
    //                                         ${DOMUtils.createSettingsInputSlider('li', 'Store', 'overStock', 0, 10, 0.1, currentSettings.overStockPercent.Store).outerHTML}
    //                                         <li class="list-group-item">
    //                                             Restaurant
    //                                             <input type="text" id="restaurant-over-stock-input" class="form-control input-xsmall pull-right mono" value="0.2" />
    //                                             <input type="range" id="restaurant-over-stock-range" class="" min="0" max="10" step="0.1" value="0.2" />
    //                                         </li>
    //                                     </ul>
    //                                 </div>
    //                                 <div class="flex-item">
    //                                     <h4>&nbsp;</h4>
    //                                     <ul class="list-group vir-list-group-strypes mt-compact">
    //                                         <li class="list-group-item">
    //                                             Warehouse
    //                                             <input type="text" id="warehouse-over-stock-input" class="form-control input-xsmall pull-right mono" value="0.2" />
    //                                             <input type="range" id="warehouse-over-stock-range" class="" min="0" max="10" step="0.1" value="0.2" />
    //                                         </li>
    //                                         <li class="list-group-item">
    //                                             Gas station
    //                                             <input type="text" id="gas-station-over-stock-input" class="form-control input-xsmall pull-right mono" value="0.2" />
    //                                             <input type="range" id="gas-station-over-stock-range" class="" min="0" max="10" step="0.1" value="0.2" />
    //                                         </li>
    //                                     </ul>
    //                                 </div>
    //                             </div>






    //                             </div>
    //                             <div class="tab-pane" id="settings-modal-advanced">
    //                                 advanced
    //                             </div>
    //                         </div>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //     </div>`;
}

module.exports = {
    overStockPercent,
    getSettings,
    openSettingsPopup,
};