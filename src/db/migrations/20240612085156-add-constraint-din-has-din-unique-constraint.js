'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface
    .addConstraint('din_has_din', {
      type: 'UNIQUE',
      fields: ['pdin_id', 'cdin_id'],
      name: 'unique_din_has_din_ids',
    }),
  down: (queryInterface, Sequelize) => queryInterface
    .removeConstraint('din_has_din', 'unique_din_has_din_ids'),
};
