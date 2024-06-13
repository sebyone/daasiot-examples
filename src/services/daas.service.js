const e = require("express");
const db = require("../db/models");
const DinLocal = db.DinLocal;
const DinLink = db.DinLink;
const DinHasDin = db.DinHasDin;

const { where, Op } = require('sequelize');

async function loadConfig(node) {
    const dinLocal = await DinLocal.findByPk(1, { raw: true, include: ['din'] });
    const dinLocalLinks = await DinLink.findAll({
        where: {
            din_id: {
                [Op.eq]: 1
            }
        },
        raw: true
    });

    const sid = parseInt(dinLocal['din.sid']);
    const din = parseInt(dinLocal['din.din']);

    // Init nodo
    const initDone = node.doInit(sid, din);

    if (initDone) {
        console.log(`[daas] doInit sid=${sid} din=${din} OK`);
    } else {
        console.error(`[daas] doInit sid=${sid} din=${din} ERROR`);
    }


    // Enable node links
    dinLocalLinks.forEach((llink) => {
        let link = parseInt(llink.link);
        let url = llink.url;

        let isEnabled = node.enableDriver(link, url);
        if (isEnabled) {
            console.log(`[daas] enableDriver link=${link} din=${url} OK`);
        } else {
            console.log(`[daas] enableDriver link=${link} din=${url} ERROR`);
        }

    });

    const dinsToMap = await DinHasDin.findAll({
        raw: true,
        where: {
            pdin_id: dinLocal.id,
        }, include: ['cdin']
    });

    dinsToMap.forEach((d) => {
        const driver = 2; // INET4
        const url = '0.0.0.0';
        const din = parseInt(d['cdin.din']);

        let isMapped = node.map(din, driver, url);

        if (isMapped) {
            console.log(`[daas] map din=${din} link=${driver} url=${url} OK`);
        } else {
            console.error(`[daas] map din=${din} link=${driver} url=${url} ERROR`);
        }
    });
};

module.exports = {
    loadConfig,
    applyConfig: loadConfig
}