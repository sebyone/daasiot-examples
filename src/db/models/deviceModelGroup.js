'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class DeviceModelGroup extends Model {
		static associate(models) {
			this.hasMany(models.DeviceModel, { foreignKey: 'device_group_id', onDelete: 'CASCADE' });
		}
	}
	DeviceModelGroup.init({
		name: DataTypes.STRING
	}, {
		sequelize,
		modelName: 'DeviceModelGroup',
		tableName: 'device_group',
		underscored: true,
		timestamps: false
	});

	return DeviceModelGroup;
};
