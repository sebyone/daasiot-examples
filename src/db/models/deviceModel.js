'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class DeviceModel extends Model {
		static associate(models) {
			this.belongsTo(models.DeviceModelGroup, { foreignKey: 'device_group_id', as: 'device_group' });
			this.hasMany(models.Device, { foreignKey: 'device_model_id', onDelete: 'CASCADE', as: 'devices' });
			this.hasMany(models.DeviceModelFunction, { foreignKey: 'device_model_id', onDelete: 'CASCADE', as: 'functions' });
		}
	}
	DeviceModel.init({
		device_group_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		description: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		serial: {
			type: DataTypes.STRING,
			allowNull: false,
			maxLength: 20,
		},
		link_image: {
			type: DataTypes.STRING,
			maxLength: 45,
			validate: {
				isUrl: true,
			}
		},
		link_datasheet: {
			type: DataTypes.STRING,
			maxLength: 45,
			validate: {
				isUrl: true,
			}
		},
		link_userguide: {
			type: DataTypes.STRING,
			maxLength: 45,
			validate: {
				isUrl: true,
			}
		},
	}, {
		sequelize,
		modelName: 'DeviceModel',
		tableName: 'device_model',
		timestamps: true,
		underscored: true,
	});
	return DeviceModel;
};

