module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('device_model_group', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
      },
      link_image: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
      },
    });

    await queryInterface.createTable('device_model', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      device_group_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'device_model_group',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      serial: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      link_image: {
        type: Sequelize.STRING,
        validate: {
          len: [0, 45],
        },
      },
      link_datasheet: {
        type: Sequelize.STRING,
        validate: {
          len: [0, 45],
        },
      },
      link_userguide: {
        type: Sequelize.STRING,
        validate: {
          len: [0, 45],
        },
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.createTable('device', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      device_model_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'device_model',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      din_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'din',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [0, 45],
        },
      },
      latitude: {
        type: Sequelize.DECIMAL(10, 8),
        validate: {
          min: -90,
          max: 90,
        },
      },
      longitude: {
        type: Sequelize.DECIMAL(11, 8),
        validate: {
          min: -180,
          max: 180,
        },
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('device');
    await queryInterface.dropTable('device_model');
    await queryInterface.dropTable('device_model_group');
  },
};
