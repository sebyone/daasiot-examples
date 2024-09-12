'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // add onDelete: 'CASCADE' to all the associations of the din table
    await queryInterface.changeColumn('din_local', 'din_id', {
      onDelete: 'CASCADE',
    });

    await queryInterface.changeColumn('din_has_din', 'pdin_id', {
      onDelete: 'CASCADE',
    });

    await queryInterface.changeColumn('din_has_din', 'cdin_id', {
      onDelete: 'CASCADE',
    });

    await queryInterface.changeColumn('din_link', 'din_id', {
      onDelete: 'CASCADE',
    });
  },

  async down (queryInterface, Sequelize) {
    // remove onDelete: 'CASCADE' from all the DIN associations
    await queryInterface.changeColumn('din_local', 'din_id', {
      onDelete: 'NO ACTION',
    });

    await queryInterface.changeColumn('din_has_din', 'pdin_id', {
      onDelete: 'NO ACTION',
    });

    await queryInterface.changeColumn('din_has_din', 'cdin_id', {
      onDelete: 'NO ACTION',
    });

    await queryInterface.changeColumn('din_link', 'din_id', {
      onDelete: 'NO ACTION',
    });
  }
};
