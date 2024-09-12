'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('din_has_din', {
      pdin_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'din',
          },
          key: 'id',
        },
        allowNull: false,
      },
      cdin_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'din',
          },
          key: 'id',
        },
        allowNull: false,
      },
    }, {
      primaryKey: ['pdin_id', 'cdin_id'],
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('din_has_din');
  }
};
