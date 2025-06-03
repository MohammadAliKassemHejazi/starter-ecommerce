// src/models/index.ts
"use strict";

import fs from "fs";
import path from "path";
import { Sequelize, DataTypes } from "sequelize";

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";

// Add error handling for config loading
let config: any;
try {
  // Try different possible paths for the config file
  const configPaths = [
    path.join(__dirname, "../config/db.config.js"),
    path.join(__dirname, "../config/db.config"),
    path.join(__dirname, "../../config/db.config.js"),
    path.join(__dirname, "../../config/db.config")
  ];
  
  let configFound = false;
  for (const configPath of configPaths) {
    try {
      if (fs.existsSync(configPath)) {
        const configModule = require(configPath);
        config = configModule.default || configModule;
        if (config && config[env]) {
          config = config[env];
          configFound = true;
          console.log(`✅ Config loaded from: ${configPath}`);
          break;
        }
      }
    } catch (err) {
      console.log(`❌ Failed to load config from: ${configPath}`);
      continue;
    }
  }
  
  if (!configFound) {
    throw new Error("Config file not found in any expected location");
  }
  
} catch (error) {
  console.error("Failed to load database config file:", error);
  console.log("🔄 Falling back to environment variables...");
  
  // Fallback to environment variables
  config = {
    username: process.env.DB_USER || process.env.DATABASE_USER,
    password: process.env.DB_PASSWORD || process.env.DATABASE_PASSWORD,
    database: env === 'production' 
      ? (process.env.DB_NAME_PROD || process.env.DATABASE_NAME || 'ecommerce_prod')
      : env === 'test'
      ? (process.env.DB_NAME_TEST || 'ecommerce_test')
      : (process.env.DB_NAME_DEV || process.env.DATABASE_NAME || 'ecommerce_dev'),
    host: process.env.DB_HOST || process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || process.env.DATABASE_PORT || '5432'),
    dialect: process.env.DB_DIALECT || 'postgres',
    dialectOptions: env === 'production' ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    } : {},
    logging: env === 'development' ? console.log : false,
    pool: {
      max: env === 'production' ? 10 : 5,
      min: env === 'production' ? 2 : 0,
      acquire: 30000,
      idle: 10000
    }
  };
  
  // If DATABASE_URL is available (common in production), use it
  if (process.env.DATABASE_URL && env === 'production') {
    config = {
      use_env_variable: 'DATABASE_URL',
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      },
      logging: false,
      pool: {
        max: 10,
        min: 2,
        acquire: 30000,
        idle: 10000
      }
    };
  }
}

// Validate configuration
if (!config) {
  throw new Error("❌ Database configuration is completely missing!");
}

console.log("🔧 Database config:", {
  dialect: config.dialect,
  host: config.host,
  port: config.port,
  database: config.database,
  use_env_variable: config.use_env_variable,
  hasUsername: !!config.username,
  hasPassword: !!config.password
});

const db: any = {};

let sequelize: any;

try {
  if (config.use_env_variable) {
    const envVar = process.env[config.use_env_variable];
    if (!envVar) {
      throw new Error(`Environment variable ${config.use_env_variable} is not set!`);
    }
    console.log(`🔗 Connecting using environment variable: ${config.use_env_variable}`);
    sequelize = new Sequelize(envVar, config);
  } else {
    if (!config.database || !config.username) {
      throw new Error("❌ Missing required database configuration: database name or username");
    }
    console.log(`🔗 Connecting to database: ${config.database} at ${config.host}:${config.port}`);
    sequelize = new Sequelize(
      config.database, // Database name
      config.username, // Database username
      config.password, // Database password
      {
        host: config.host, // Database host
        port: config.port, // Database port
        dialect: config.dialect, // Database dialect (e.g., 'postgres')
        dialectOptions: config.dialectOptions, // SSL/TLS options
        logging: config.logging, // Enable/disable logging
        pool: config.pool // Connection pool settings
      }
    );
  }
} catch (error) {
  console.error("❌ Failed to initialize Sequelize:", error);
  throw error;
}

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log("✅ Database connection established successfully.");
  })
  .catch((err: any) => {
    console.error("❌ Unable to connect to the database:", err);
  });

// Load models
const modelFiles = fs.readdirSync(__dirname)
  .filter((file: string) => {
    return (
      file.indexOf(".") !== 0 && 
      file !== basename && 
      (file.slice(-3) === ".ts" || file.slice(-3) === ".js") &&
      file !== "index.ts" &&
      file !== "index.js"
    );
  });

console.log(`📁 Loading ${modelFiles.length} model files:`, modelFiles);

modelFiles.forEach((file: string) => {
  try {
    const model = require(path.join(__dirname, file))(
      sequelize,
      DataTypes
    );
    db[model.name] = model;
    console.log(`✅ Loaded model: ${model.name}`);
  } catch (error) {
    console.error(`❌ Failed to load model from file: ${file}`, error);
  }
});

// Set up associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    try {
      db[modelName].associate(db);
      console.log(`🔗 Set up associations for: ${modelName}`);
    } catch (error) {
      console.error(`❌ Failed to set up associations for: ${modelName}`, error);
    }
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

console.log(`🎉 Database initialization complete. Models loaded: ${Object.keys(db).filter(key => key !== 'sequelize' && key !== 'Sequelize').join(', ')}`);

export default db;