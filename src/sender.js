const { DaasIoT } = require("daas-sdk");


console.log("SENDER")

const INET4 = 2;

const SID = 100;
const DIN = 102;
const URL = "127.0.0.1:2102"

const REMOTE_DIN = 101;
const REMOTE_URL = "127.0.0.1:2101";

const hver = "nodeJS";

const daasApi = new DaasIoT(hver);

daasApi.onDinConnected((din) => { console.log("📌 DIN Accepted: " + din); });

daasApi.onDDOReceived((din) => {
    console.log("🔔 DDO received from DIN: " + din);
    daasApi.locate(din);
    daasApi.pull(din, (origin, timestamp, typeset, data) => {
        console.log(`⬇⬇ Pulling data from DIN: ${origin} timestamp: ${timestamp} - typeset: ${typeset} - data: `);
        console.log(data);
    });
});

daasApi.doInit(SID, DIN);

if (daasApi.enableDriver(INET4, URL)) {
    console.log("Driver enabled!");
}

daasApi.map(REMOTE_DIN, INET4, REMOTE_URL);

if (daasApi.doPerform()) {
    console.log("Node performed!");
}

console.log(`🟢 DaasIoT Node enabled! (sid: ${SID} | din: ${DIN} | host: ${URL})`)

setInterval(() => {
    const located = daasApi.locate(REMOTE_DIN);
    console.log(`🔍 Locate ${REMOTE_DIN}: ${located}`);

    if (located || true) {
        const payload = {
            message: "Ciao Mondo!!!"
        }

        let timestamp = new Date().getTime();

        daasApi.push(REMOTE_DIN, 10, timestamp, JSON.stringify(payload));
        console.log(`⬆⬆ Pushing data to ${REMOTE_DIN} done.`);
    }
}, 5000)