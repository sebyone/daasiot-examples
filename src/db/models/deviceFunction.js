const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class DeviceFunction extends Model {
    static associate(models) {
      this.belongsTo(models.Device, { foreignKey: 'device_id', as: 'device' });
      this.belongsTo(models.DeviceModelFunction, { foreignKey: 'device_model_function_id', as: 'function' });

      this.hasMany(models.DeviceFunctionProperty, { foreignKey: 'device_function_id', sourceKey: 'id', as: 'parameters', scope: { property_type: 1 } });
      
      this.hasMany(models.DeviceFunctionProperty, { foreignKey: 'device_function_id', sourceKey: 'id', as: 'inputs', scope: { property_type: 2 } });
      
      this.hasMany(models.DeviceFunctionProperty, { foreignKey: 'device_function_id', sourceKey: 'id', as: 'outputs', scope: { property_type: 3 } });
      
      this.hasMany(models.DeviceFunctionProperty, { foreignKey: 'device_function_id', sourceKey: 'id', as: 'notifications', scope: { property_type: 4 } });
    }
  }

  DeviceFunction.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    device_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'device',
        key: 'id'
      }
    },
    device_model_function_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'device_model_function',
        key: 'id'
      }
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'DeviceFunction',
    tableName: 'device_function',
    underscored: true,
    timestamps: true
  });

  return DeviceFunction;
};
