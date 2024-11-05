/*
 * DaaS-nodejs 2024 (@) Sebyone Srl
 *
 * File: daas.service.js
 *
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * This Source Code Form is "Incompatible With Secondary Licenses", as defined by the MPL v.2.0.
 *
 * Contributors:
 * alessio.farfaglia@gmail.com - initial implementation
 *
 */

const db = require('../db/models');


async function createDDO(originDin, destinationDin, payload, timestamp_seconds, typeset) {
  const t = await db.sequelize.transaction();
  try {
    if (!originDin) {
      throw new Error('Invalid origin DIN', originDin);
    }
    if (!destinationDin) {
      throw new Error('Invalid destination DIN', destinationDin);
    }
    if (!typeset) {
      throw new Error('Invalid typeset', typeset);
    }

    if (payload == undefined) {
      payload = '';
    }

    const payloadSize = payload.length || 0;
    const payloadBase64 = Buffer.from(payload).toString('base64');
    const din_src = await db.Din.findOne({ where: { din: originDin }, transaction: t });
    if (!din_src) {
      throw new Error(`DIN ${originDin} not found`);
    }
    const din_dst = await db.Din.findOne({ where: { din: destinationDin }, transaction: t });
    if (!din_dst) {
      throw new Error(`DIN ${destinationDin} not found`);
    }

    // TODO: get typeset_id from typeset when implemented 
    // const typeset_id = await db.Typeset.findOne({ where: { typeset }, transaction: t });
    const typeset_id = typeset;

    let timestamp_str;
    if (timestamp_seconds) {
      timestamp_str = new Date(timestamp_seconds * 1000).toISOString();
    } else {
      timestamp_str = new Date().toISOString();
    }
    const ddo = await db.DDO.create({
      din_id_dst: din_dst.id,
      din_id_src: din_src.id,
      timestamp: timestamp_str,
      typeset_id: typeset_id,
      payload: payloadBase64,
      payload_size: payloadSize,
    }, { transaction: t });

    await t.commit();
    return ddo;
  }
  catch (error) {
    await t.rollback();
    console.error(error);
    return null;
  }
}

module.exports = {
  createDDO: createDDO,
};
