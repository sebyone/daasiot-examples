'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('device_model', 'link_image');
    await queryInterface.removeColumn('device_model', 'link_datasheet');
    await queryInterface.removeColumn('device_model', 'link_userguide');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('device_model', 'link_image', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '',
      validate: {
        isUrl: true,
      },
    });
    await queryInterface.addColumn('device_model', 'link_datasheet', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '',
      validate: {
        isUrl: true,
      },
    });
    await queryInterface.addColumn('device_model', 'link_userguide', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '',
      validate: {
        isUrl: true,
      },
    });
  },
};
