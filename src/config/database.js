module.exports = {
  development: {
    dialect: "sqlite",
    storage: "database.sqlite",
    define: {
      timestamps: true,
      underscored: true,
    },
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    dialect: "sqlite",
    storage: "database.sqlite",
    define: {
      timestamps: true,
      underscored: true,
    },
  }
}
