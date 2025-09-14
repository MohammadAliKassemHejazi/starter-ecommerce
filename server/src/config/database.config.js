module.exports = {
  development: {
    username: 'postgres',
    password: 'password',
    database: 'ecommerce_dev',
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    logging: console.log
  },
  test: {
    username: 'postgres',
    password: 'password',
    database: 'ecommerce_test',
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    logging: false
  },
  production: {
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'ecommerce_prod',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false
  }
};
