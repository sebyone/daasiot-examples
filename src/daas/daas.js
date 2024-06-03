const { DaasIoT } = require("daas-sdk");
const hver = "nodeJS";

let nodeInstance = new DaasIoT(hver);

const _onDinConnected = ((din) => { console.log("📌 DIN Accepted: " + din); });
const _onDDOReceived = ((din) => {
    console.log("🔔 DDO received from DIN: " + din);
    nodeInstance.locate(din);

    nodeInstance.pull(din, (origin, timestamp, typeset, data) => {
        let readableTimestamp = new Date(timestamp * 1000).toISOString()

        console.log(`..⬇⬇ Pulling data from DIN: ${origin} - timestamp: ${readableTimestamp} - typeset: ${typeset}: ${data}`);
        console.log(data);
        let decodedData = decode(data);
    });
});

function configure(sid, din, drivers = [], devices = []) {
    nodeInstance.doInit(sid, din);

    // nodeInstance.onDinConnected(onDinConnected)
    // nodeInstance.onDDOReceived(onDDOReceived)

    drivers.forEach(driver => {
        nodeInstance.enableDriver(driver.type, driver.url);
        console.log(`Driver ${driver.type} on ${driver.url} enabled.`);
    });

    devices.forEach(device => {
        nodeInstance.map(device.din, device.driverType, device.url);
        console.log(`Device ${device.din} on ${device.driverType} : ${device.url} mapped.`);
    });

    return nodeInstance;
}

function getNode() {
    return nodeInstance;
}

function start() {
    nodeInstance.doPerform();
}

function stop() {
    nodeInstance.doEnd();
}

function restart() {
    nodeInstance.restart();
}

function send(din, typeset, data) {
    const located = nodeInstance.locate(din);

    if (!located) throw new Error(`Node ${din} is not located!`)

    let timestamp = new Date().getTime();
    nodeInstance.push(din, typeset, timestamp, data);
}

module.exports = {
    configure,
    start,
    stop,
    getNode,
    restart,
    send,
}