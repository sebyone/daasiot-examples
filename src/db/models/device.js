'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Device extends Model {
    static associate(models) {
      this.belongsTo(models.DeviceModel, { foreignKey: 'device_model_id', as: 'device_model', onDelete: 'CASCADE' });
      this.belongsTo(models.Din, { foreignKey: 'din_id', as: 'din', onDelete: 'CASCADE' });
    }
  }
  Device.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    device_model_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    serial: {
      type: DataTypes.STRING,
      allowNull: false,
      maxLength: 20,
    },
    din_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Device',
    tableName: 'device',
    underscored: true,
    timestamps: false,
  });
  return Device;
};
