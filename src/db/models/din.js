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
      this.hasOne(models.DinLocal, { foreignKey: 'din_id', onDelete: 'CASCADE', as: 'receiver' });
      this.belongsToMany(models.Din, { through: models.DinHasDin, as: 'parents', foreignKey: 'pdin_id', onDelete: 'CASCADE' });
      this.belongsToMany(models.Din, { through: models.DinHasDin, as: 'children', foreignKey: 'cdin_id', onDelete: 'CASCADE' });
      this.hasMany(models.DinLink, { foreignKey: 'din_id', as: 'links', onDelete: 'CASCADE' });
      this.hasOne(models.Device, { foreignKey: 'din_id', onDelete: 'CASCADE' });
      this.hasMany(models.DDO, { foreignKey: 'din_id_dst', as: 'received_ddos', onDelete: 'CASCADE' });
      this.hasMany(models.DDO, { foreignKey: 'din_id_src', as: 'sent_ddos', onDelete: 'CASCADE' });
      // define association here
    }
  }
  Din.init({
    sid: {
      type: DataTypes.STRING.BINARY,
      allowNull: false,
      unique: 'unique_din_din_sid',
    },
    din: {
      type: DataTypes.STRING.BINARY,
      allowNull: false,
      unique: 'unique_din_din_sid',
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
    indexes: [
      {
        unique: true,
        fields: ['sid', 'din'],
        name: 'index_din_sid_din'
      }
    ]
  });


  return Din;
};
