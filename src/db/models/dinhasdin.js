'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DinHasDin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  DinHasDin.init({
    pdin_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Din,
        key: 'id',
      },
      allowNull: false,
    },
    cdin_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Din,
        key: 'id',
      },
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'DinHasDin',
    tableName: 'din_local',
    underscored: true,
    timestamps: false,
  });
  return DinHasDin;
};