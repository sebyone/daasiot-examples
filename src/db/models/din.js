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
      this.hasOne(models.DinLocal, { foreignKey: 'din_id', onDelete: 'CASCADE' });
      this.belongsToMany(models.Din, { through: models.DinHasDin, as: 'parents', foreignKey: 'pdin_id', onDelete: 'CASCADE'});
      this.belongsToMany(models.Din, { through: models.DinHasDin, as: 'children', foreignKey: 'cdin_id', onDelete: 'CASCADE'});
      this.hasMany(models.DinLink, { foreignKey: 'din_id', as: 'links', onDelete: 'CASCADE' });
      this.hasOne(models.Device, { foreignKey: 'din_id', onDelete: 'CASCADE' });
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
      defaultValue: 0,
    },
    skey: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
  }, {
    sequelize,
    tableName: 'din',
    modelName: 'Din',
    timestamps: true,
    underscored: true,
  });

  
  return Din;
};
