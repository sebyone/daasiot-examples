'use strict';
const {
  Model
} = require('sequelize');

const { Din } = require('./din');

module.exports = (sequelize, DataTypes) => {
  class DinLocal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Din, { foreignKey: 'din_id', as: 'din', tableName: 'din' });
      this.hasMany(models.DinLink, { foreignKey: 'din_id', sourceKey: 'din_id', as: 'links' });
      this.hasOne(models.Device, { foreignKey: 'din_id', sourceKey: 'din_id', as: 'device' });
    }
  }
  DinLocal.init({
    title: DataTypes.STRING,
    din_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Din,
        key: 'id',
      },
    },
    acpt_all: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    enable: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'DinLocal',
    tableName: 'din_local',
    timestamps: true,
    underscored: true,
  });

  return DinLocal;
};
