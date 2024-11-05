'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class DDO extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // this.belongsTo(models.Typeset, { foreignKey: 'typeset_id', as: 'typeset' });
      this.belongsTo(models.Din, { foreignKey: 'din_id_dst', as: 'din_dst' });
      this.belongsTo(models.Din, { foreignKey: 'din_id_src', as: 'din_src' });
    }
  }
  DDO.init({
    din_id_dst: {
      type: DataTypes.INTEGER,
      references: {
        model: 'din',
        key: 'id',
      },
      allowNull: false,
    },
    din_id_src: {
      type: DataTypes.INTEGER,
      references: {
        model: 'din',
        key: 'id',
      },
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    typeset_id: {
      type: DataTypes.INTEGER,
      // TODO: temporary, remove when typeset is implemented 
      allowNull: true,
    },
    payload: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    payload_size: {
      type: DataTypes.INTEGER,
      validate: {
        min: 0,
      },
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'DDO',
    timestamps: false,
    underscored: true,
    tableName: 'ddo',
  });
  return DDO;
};
