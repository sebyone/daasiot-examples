'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('din_has_din', {
      // id: {
      //   allowNull: false,
      //   autoIncrement: true,
      //   primaryKey: true,
      //   type: Sequelize.INTEGER
      // },
      pdin_id: {
        type: Sequelize.INTEGER,
        references: {
          model: Din,
          key: 'id',
        },
        allowNull: false,
      },
      cdin_id: {
        type: Sequelize.INTEGER,
        references: {
          model: Din,
          key: 'id',
        },
        allowNull: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('din_has_din');
  }
};