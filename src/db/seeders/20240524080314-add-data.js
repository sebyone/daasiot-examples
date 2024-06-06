'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkInsert('din', [{
        id: 1,
        sid: '100',
        din: '101',
        p_res: '000',
        skey: '3b92a1a3d85b8',
        created_at: '2024-05-24 08:35:57.050 +00:00'
      }, {
        id: 2,
        sid: '100',
        din: '102',
        p_res: '000',
        skey: '9efafc3b2a94f',
        created_at: '2024-05-24 08:35:57.050 +00:00'
      }
      ], { transaction });

      await queryInterface.bulkInsert('din_local', [{
        title: "Default Gateway node",
        din_id: 1,
        enable: true,
        created_at: '2024-05-24 08:35:57.050 +00:00'
      }], { transaction });

      await queryInterface.bulkInsert('din_link', [{
        din_id: 1,
        link: 2,
        url: '127.0.0.1:2101',
        created_at: '2024-05-24 08:35:57.050 +00:00'
      },
      {
        din_id: 2,
        link: 2,
        url: '127.0.0.1:2102',
        created_at: '2024-05-24 08:35:57.050 +00:00'
      }
      ], { transaction });

      await queryInterface.bulkInsert('din_has_din', [{
        pdin_id: 1,
        cdin_id: 2,
      }], { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // 
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
    await queryInterface.bulkDelete('Din', null, {});
  }
};
