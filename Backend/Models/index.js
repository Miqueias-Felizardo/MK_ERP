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
    logging: false
  }
);

const db = {};
db.sequelize = sequelize;
db.Sequelize  = Sequelize;

// Tabelas de domínio
db.Cor       = require('./Cor')(sequelize, Sequelize.DataTypes);
db.Tamanho   = require('./Tamanho')(sequelize, Sequelize.DataTypes);
db.Estampa   = require('./Estampa')(sequelize, Sequelize.DataTypes);

// Tabelas principais
db.Categoria  = require('./Categoria')(sequelize, Sequelize.DataTypes);
db.Produto    = require('./Produto')(sequelize, Sequelize.DataTypes);
db.SKU        = require('./SKU')(sequelize, Sequelize.DataTypes);
db.Estoque    = require('./Estoque')(sequelize, Sequelize.DataTypes);
db.Preco      = require('./Preco')(sequelize, Sequelize.DataTypes);

// Tabelas transacionais
db.Cliente    = require('./Cliente')(sequelize, Sequelize.DataTypes);
db.Pedido     = require('./Pedido')(sequelize, Sequelize.DataTypes);
db.PedidoItem = require('./PedidoItem')(sequelize, Sequelize.DataTypes);

// Executa todos os relacionamentos
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
