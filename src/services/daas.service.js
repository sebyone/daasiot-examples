const e = require("express");
const db = require("../db/models");
const DinLocal = db.DinLocal;
const DinLink = db.DinLink;
const DinHasDin = db.DinHasDin;

const { Op } = require('sequelize');

const localDinId = 1;

async function loadConfig(node) {
    
    const dinLocal = await DinLocal.findByPk(localDinId, { raw: true, include: ['din'] });
    const dinLocalLinks = await DinLink.findAll({
        where: {
            din_id: localDinId
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
    
    dinsToMap.forEach(async (d) => {
        const dinId = parseInt(d['cdin.id']);
        const din = parseInt(d['cdin.din']);


        // TODO: do this once, instead of for each din
        const link = await DinLink.findOne({
            where: {
                din_id: dinId
            },
            raw: true
        });

        let isMapped = false;
        let driver = 2;
        let url = '0.0.0.0:0';

        if (link !== null) {
            driver = parseInt(link.link);
            url = link.url;
        }
        
        isMapped = node.map(din, driver, url);

        if (isMapped) {
            console.log(`[daas] map din=${din} driver=${driver} url=${url} OK`);
        } else {
            console.error(`[daas] ERROR while mapping din=${din} driver=${driver} url=${url}`);
        }

    });
};

module.exports = {
    loadConfig,
    applyConfig: loadConfig
}
