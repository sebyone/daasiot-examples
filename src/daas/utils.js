exports.decode = function (data) {
    let utf8decoder = new TextDecoder();
    let decodedData = utf8decoder.decode(data);

    return JSON.parse(decodedData);
}