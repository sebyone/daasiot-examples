'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class DeviceModel extends Model {
		static associate(models) {
			this.belongsTo(models.DeviceModelGroup, { foreignKey: 'device_group_id', as: 'device_group' });
			this.hasMany(models.Device, { foreignKey: 'device_model_id', onDelete: 'CASCADE' });
		}
	}
	DeviceModel.init({
		device_group_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		productcode: {
			type: DataTypes.STRING,
			allowNull: true,
			maxLength: 45,
		},
		datasheet: {
			type: DataTypes.STRING,
			allowNull: true,
			maxLength: 45,
		},
		userguide: {
			type: DataTypes.STRING,
			allowNull: true,
			maxLength: 45,
		},
		
	}, {
		sequelize,
		modelName: 'DeviceModel',
		tableName: 'device_model',
		underscored: true,
		timestamps: false,
	});
	return DeviceModel;
};
