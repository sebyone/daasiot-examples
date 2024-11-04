'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('din', {
      type: 'unique',
      fields: ['sid', 'din'],
      name: 'unique_din_din_sid',
    });

    // Add index for performance
    await queryInterface.addIndex('din', ['sid', 'din'], {
      unique: true,
      name: 'index_din_sid_din',
    });

  },
  down: async (queryInterface, Sequelize) => {
    // Remove index
    await queryInterface.removeIndex('din', 'index_din_sid_din');

    // Remove unique constraint
    await queryInterface.removeConstraint('din', 'unique_din_din_sid');
  }
};
