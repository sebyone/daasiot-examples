'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('device_model_function_property', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      property_type: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(45),
        allowNull: false
      },
      function_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'device_model_function',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      data_type: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      default_value: {
        type: Sequelize.STRING(45),
        allowNull: false
      },
      safe_value: {
        type: Sequelize.STRING(45),
        allowNull: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('device_model_function_property');
  }
};
