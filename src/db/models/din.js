'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Din extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasOne(models.DinLocal, { foreignKey: 'din_id' });
      this.belongsToMany(models.Din, { through: models.DinHasDin, as: 'parents', foreignKey: 'pdin_id' });
      this.belongsToMany(models.Din, { through: models.DinHasDin, as: 'siblings', foreignKey: 'cdin_id' });
      // define association here
    }
  }
  Din.init({
    sid: {
      type: DataTypes.STRING.BINARY,
      allowNull: false,
    },
    din: {
      type: DataTypes.STRING.BINARY,
      allowNull: false,
    },
    p_res: {
      type: DataTypes.STRING.BINARY,
    },
    skey: {
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    tableName: 'din',
    modelName: 'Din',
    underscored: true,
    timestamps: false,
  });

  return Din;
};
