function parseVirtNum(virtNum) {
    if (virtNum == null)
        return null;

    return parseFloat(virtNum.replace(/ |\$/g, ""));
}

module.exports = {
    parseVirtNum,
};