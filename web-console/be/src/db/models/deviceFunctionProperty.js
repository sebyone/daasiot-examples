'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class DeviceFunctionProperty extends Model {
    static associate(models) {
      this.belongsTo(models.DeviceFunction, { foreignKey: 'device_function_id', as: 'device_function', onDelete: 'CASCADE' });
      this.belongsTo(models.DeviceModelFunctionProperty, { foreignKey: 'property_id', as: 'property_template', onDelete: 'CASCADE' });
    }
  }

  DeviceFunctionProperty.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    property_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'device_model_function_property',
        key: 'id'
      }
    },
    device_function_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'device_function',
        key: 'id'
      }
    },
    // needed for the association with DeviceFunction, to filter by property_type
    // without having to check using the device_model_function_property table
    property_type: {
      type: DataTypes.INTEGER,
      validate: {
        isIn: [[1, 2, 3, 4]],
      },
      allowNull: false
    },
    value: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'DeviceFunctionProperty',
    tableName: 'device_function_property',
    underscored: true,
    timestamps: false
  });

  return DeviceFunctionProperty;
};
