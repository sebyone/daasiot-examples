/**
 * parses the Json object coming in into a Javascript object
 * @param {object} data
 * @returns {object}
 */
function decode(data) {
    const utf8decoder = new TextDecoder();
    const decodedData = utf8decoder.decode(data);
    return JSON.parse(decodedData);
}

/**
 * gets the current time in HH:MM:SS format
 * @returns {string}
 */
function getTime() {
    return new Date().toTimeString().split(' ')[0]
}

module.exports = {
    decode,
    getTime
}
