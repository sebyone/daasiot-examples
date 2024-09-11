'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('din', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sid: {
        type: Sequelize.STRING.BINARY,
        allowNull: false,
      },
      din: {
        type: Sequelize.STRING.BINARY,
        allowNull: false,
      },
      p_res: {
        type: Sequelize.STRING.BINARY,
        allowNull: false,
      },
      skey: {
        type: Sequelize.STRING,
      },
      created_at: {
        allowNull: true,
        type: Sequelize.DATE
      },
      updated_at: {
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('din');
  }
};
