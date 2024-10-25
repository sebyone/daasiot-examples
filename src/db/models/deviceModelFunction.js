const { Model, DataTypes } = require('sequelize');


module.exports = (sequelize, DataTypes) => {

  class DeviceModelFunction extends Model {
    static associate(models) {
      this.belongsTo(models.DeviceModel, { foreignKey: 'device_model_id', as: 'device_model' });
      this.hasMany(models.DeviceModelFunctionProperty, { foreignKey: 'function_id', sourceKey: 'id', as: 'properties' });
      
      this.hasMany(models.DeviceModelFunctionProperty, {
        foreignKey: 'function_id',
        sourceKey: 'id',
        as: 'parameters',
        scope: {
          property_type: 1
        }
      });

      this.hasMany(models.DeviceModelFunctionProperty, {
        foreignKey: 'function_id',
        sourceKey: 'id',
        as: 'inputs',
        scope: {
          property_type: 2
        }
      });

      this.hasMany(models.DeviceModelFunctionProperty, {
        foreignKey: 'function_id',
        sourceKey: 'id',
        as: 'outputs',
        scope: {
          property_type: 3
        }
      });

      this.hasMany(models.DeviceModelFunctionProperty, {
        foreignKey: 'function_id',
        sourceKey: 'id',
        as: 'notifications',
        scope: {
          property_type: 4
        }
      });

    }
  }

  DeviceModelFunction.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    device_model_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'device_model',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'DeviceModelFunction',
    tableName: 'device_model_function',
    underscored: true,
    timestamps: true
  });

  return DeviceModelFunction;
}
