import config from "./config"; // this is important!

module.exports = {
  development: {
    username: config.database.username,
    password: config.database.password,
    database: config.database.dbDevelopment,
    host: config.database.host,
    port: config.database.port || 5432, // Include port if needed
    dialect: config.database.dialect,
    dialectOptions: config.database.dialectOptions, // Add SSL/TLS options
    logging: false, // Disable logging if not needed
  },
  test: {
    username: config.database.username,
    password: config.database.password,
    database: config.database.dbTest,
    host: config.database.host,
    port: config.database.port || 5432,
    dialect: config.database.dialect,
    dialectOptions: config.database.dialectOptions,
    logging: false,
  },
  production: {
    username: config.database.username,
    password: config.database.password,
    database: config.database.dbProduction,
    host: config.database.host,
    port: config.database.port || 5432,
    dialect: config.database.dialect,
    dialectOptions: config.database.dialectOptions,
    logging: false,
  },
};