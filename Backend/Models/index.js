'use strict';
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host:    process.env.DB_HOST,
    port:    Number(process.env.DB_PORT),
    dialect: 'postgres',
    logging: (sql) => console.log(`\n[SQL] ${sql}\n`),
  }
);

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Tabelas de domínio — dados base independentes
db.Cor      = require('./Cor')(sequelize, Sequelize.DataTypes);
db.Tamanho  = require('./Estampa')(sequelize, Sequelize.DataTypes);
db.Estampa  = require('./Tamanho')(sequelize, Sequelize.DataTypes);

// Executa os relacionamentos de todos os models
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
