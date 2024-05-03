const { DaasIoT } = require("./libdaas.node");

console.log("RECEIVER")

const INET4 = 2;

const SID = 100;
const DIN = 101;
const URL = '0.0.0.0:2101'

const REMOTE_DIN = 102;
const REMOTE_URL = '127.0.0.1:2102';

const hver = "nodeJS";

const daasApi = new DaasIoT(hver);

daasApi.onDinConnected((din) => { console.log("DIN Accepted: " + din); });

daasApi.onDDOReceived((din) => {
    console.log("DDO received for DIN: " + din);
    daasApi.locate(din);

    daasApi.pull(din, (origin, timestamp, typeset, data) => {
        console.log(`⬇ Pulling data from DIN: ${origin} timestamp: ${timestamp} - typeset: ${typeset} - data: `);
        console.log(data);
    });
});

daasApi.doInit(SID, DIN);

drivers = daasApi.listAvailableDrivers();

for (const element of drivers) {
  console.log(element);
}

if (daasApi.doPerform()) {
    console.log("Node performed!");
}

if (daasApi.enableDriver(INET4, URL)) {
    console.log("Driver enabled!");
}

if (daasApi.map(REMOTE_DIN, INET4, REMOTE_URL)) {
    console.log("Remote Node Mapped");
}

setInterval(() => {
    if(daasApi.locate(REMOTE_DIN)){
        console.log("Node Located...");
        if(daasApi.push(REMOTE_DIN, 10, 1234567890,  "Ciao Mondo!!!"))
            console.log(`⬆ Pushing data to ${REMOTE_DIN} done.`);
    }
    
}, 5000)