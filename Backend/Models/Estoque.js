'use strict';

module.exports = (sequelize, DataTypes) => {

  const Estoque = sequelize.define('Estoque', {

    id: {
      type:          DataTypes.INTEGER,
      primaryKey:    true,
      autoIncrement: true
    },

    // FK → skus — estoque é sempre de um SKU específico
    sku_id: {
      type:       DataTypes.INTEGER,
      allowNull:  false,
      references: { model: 'skus', key: 'id' }
    },

    // Nome do depósito — base para WMS futuro
    // Ex: 'PRINCIPAL', 'FILIAL-SP', 'GALPAO-2'
    deposito: {
      type:         DataTypes.STRING(50),
      allowNull:    false,
      defaultValue: 'PRINCIPAL'
    },

    // Posição dentro do depósito
    // Ex: 'A1', 'PRATELEIRA-3', 'GERAL'
    localizacao: {
      type:         DataTypes.STRING(50),
      allowNull:    false,
      defaultValue: 'GERAL'
    },

    quantidade: {
      type:         DataTypes.DECIMAL(10,3),
      allowNull:    false,
      defaultValue: 0
    },

    // Quantidade mínima — abaixo disso gera alerta de reposição
    estoque_minimo: {
      type:         DataTypes.DECIMAL(10,3),
      allowNull:    false,
      defaultValue: 0
    }

  }, {
    tableName:   'estoques',
    timestamps:  true,
    underscored: true
  });

  Estoque.associate = (models) => {
    // Estoque pertence a um SKU
    Estoque.belongsTo(models.SKU, {
      foreignKey: 'sku_id',
      as:         'sku'
    });
  };

  return Estoque;
};
