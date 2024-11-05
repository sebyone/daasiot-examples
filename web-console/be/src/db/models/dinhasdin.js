'use strict';
const {
  Model
} = require('sequelize');

const { Din } = require('./din');

module.exports = (sequelize, DataTypes) => {
  class DinHasDin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Din, { primaryKey: 'pdin_id', as: 'pdin', onDelete: 'CASCADE' });
      this.belongsTo(models.Din, { primaryKey: 'cdin_id', as: 'cdin', onDelete: 'CASCADE' });
    }
  }

  DinHasDin.init({

    // id del DIN del nodo padre, in quale mappa il DIN con id 'cdin_id'
    pdin_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'din',
        key: 'id',
      },
      allowNull: false,
    },
    // id del DIN del nodo figlio, mappato dal nodo padre con id 'pdin_id'
    cdin_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'din',
        key: 'id',
      },
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'DinHasDin',
    tableName: 'din_has_din',
    underscored: true,
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['pdin_id', 'cdin_id']  // Composite primary key (no individual unique constraints)
      }
    ]
  });

  return DinHasDin;
};
