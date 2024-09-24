'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class DeviceGroup extends Model {
		static associate(models) {
			this.hasMany(models.DeviceModel, { foreignKey: 'device_group_id', onDelete: 'CASCADE' });
		}
	}
	DeviceGroup.init({
		name: DataTypes.STRING
	}, {
		sequelize,
		modelName: 'DeviceGroup',
		tableName: 'device_group',
		underscored: true,
		timestamps: false
	});

	return DeviceGroup;
};
