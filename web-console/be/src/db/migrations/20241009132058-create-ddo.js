'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ddo', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      din_id_dst: {
        type: Sequelize.INTEGER,
        references: {
          model: 'din',
          key: 'id',
        },
        allowNull: false,
      },
      din_id_src: {
        type: Sequelize.INTEGER,
        references: {
          model: 'din',
          key: 'id',
        },
        allowNull: false,
      },
      timestamp: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      typeset_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      payload: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      payload_size: {
        type: Sequelize.INTEGER,
        validate: {
          min: 0,
        },
        allowNull: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ddo');
  }
};
