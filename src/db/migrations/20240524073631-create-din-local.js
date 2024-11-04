'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('din_local', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      din_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'din',
          },
          key: 'id',
        },
        allowNull: false
      },
      acpt_all: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      enable: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('din_local');
  }
};
