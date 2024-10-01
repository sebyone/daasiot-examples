'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class DeviceModelGroup extends Model {
		static associate(models) {
			this.hasMany(models.DeviceModel, { foreignKey: 'device_group_id', onDelete: 'CASCADE' });
		}
	}
	DeviceModelGroup.init({
		title: {
			type: DataTypes.STRING,
			allowNull: false,
			maxLength: 45,
		},
		description: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: '',
		},
		link_image: {
			type: DataTypes.STRING,
			allowNull: false,
			maxLength: 45,
			defaultValue: '',
		},
	}, {
		sequelize,
		modelName: 'DeviceModelGroup',
		tableName: 'device_model_group',
		timestamps: false,
		underscored: true,
	});

	return DeviceModelGroup;
};
