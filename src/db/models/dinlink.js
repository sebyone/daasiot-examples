'use strict';
const {
  Model
} = require('sequelize');

// const { Din } = require('./din');

module.exports = (sequelize, DataTypes) => {
  class DinLink extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Din, { foreignKey: 'din_id', as: 'din', tableName: 'din' });
    }
  }
  DinLink.init({
    link: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isIn: [[1, 2, 3, 4]],
      }
    },
    din_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'din',
        key: 'id',
      },
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'DinLink',
    tableName: 'din_link',
    timestamps: true,
    underscored: true,
  });
  return DinLink;
};
