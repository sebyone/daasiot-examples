const { Sequelize, DataTypes } = require('sequelize');
const db = require('../_config/database');
const { enable } = require('express/lib/application');


const Din = db.define('din', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
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
});

const DinLocal = db.define('din_local', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    din_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
    },
    acpt_all: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    enable: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
});

const DinLink = db.define('din_link', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    din_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    link: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = Din;