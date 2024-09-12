'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface
    .addConstraint('din', {
      type: 'unique',
      fields: ['sid', 'din'],
      name: 'unique_din_din_sid',
    }),
  down: (queryInterface, Sequelize) => queryInterface
    .removeConstraint('din', 'unique_din_din_sid'),
};
