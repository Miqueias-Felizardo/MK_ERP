'use strict';
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT), // converte para número explicitamente
    dialect: 'postgres',
    logging: (sql) => console.log(`\n[SQL] ${sql}\n`),
  }
);

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
