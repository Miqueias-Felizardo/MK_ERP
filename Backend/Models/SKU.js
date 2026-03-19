'use strict';

module.exports = (sequelize, DataTypes) => {

  const SKU = sequelize.define('SKU', {

    id: {
      type:          DataTypes.INTEGER,
      primaryKey:    true,
      autoIncrement: true
    },

    // Código único da variação — Ex: 'CAM-001-AZ-M'
    codigo: {
      type:      DataTypes.STRING(50),
      allowNull: false,
      unique:    true
    },

    // FK → produtos — todo SKU pertence a um produto
    produto_id: {
      type:       DataTypes.INTEGER,
      allowNull:  false,
      references: { model: 'produtos', key: 'id' }
    },

    // FK → cores — opcional, nem todo produto tem cor
    cor_id: {
      type:       DataTypes.INTEGER,
      allowNull:  true,
      references: { model: 'cores', key: 'id' }
    },

    // FK → tamanhos — opcional
    tamanho_id: {
      type:       DataTypes.INTEGER,
      allowNull:  true,
      references: { model: 'tamanhos', key: 'id' }
    },

    // FK → estampas — opcional
    estampa_id: {
      type:       DataTypes.INTEGER,
      allowNull:  true,
      references: { model: 'estampas', key: 'id' }
    },

    // Código de barras EAN-13
    ean13: {
      type:      DataTypes.STRING(13),
      allowNull: true,
      unique:    true
    },

    // Código fiscal — obrigatório em notas fiscais
    ncm: {
      type:      DataTypes.STRING(10),
      allowNull: true
    },

    // Peso em kg — usado para cálculo de frete
    peso: {
      type:         DataTypes.DECIMAL(10,3),
      allowNull:    false,
      defaultValue: 0
    },

    // Dimensões em cm — usadas para frete por cubagem
    altura:      { type: DataTypes.DECIMAL(10,2), defaultValue: 0 },
    largura:     { type: DataTypes.DECIMAL(10,2), defaultValue: 0 },
    comprimento: { type: DataTypes.DECIMAL(10,2), defaultValue: 0 },

    ativo: {
      type:         DataTypes.BOOLEAN,
      allowNull:    false,
      defaultValue: true
    }

  }, {
    tableName:   'skus',
    timestamps:  true,
    underscored: true
  });

  SKU.associate = (models) => {
    // SKU pertence a um Produto
    SKU.belongsTo(models.Produto, {
      foreignKey: 'produto_id',
      as:         'produto'
    });

    // SKU pertence a uma Cor
    SKU.belongsTo(models.Cor, {
      foreignKey: 'cor_id',
      as:         'cor'
    });

    // SKU pertence a um Tamanho
    SKU.belongsTo(models.Tamanho, {
      foreignKey: 'tamanho_id',
      as:         'tamanho'
    });

    // SKU pertence a uma Estampa
    SKU.belongsTo(models.Estampa, {
      foreignKey: 'estampa_id',
      as:         'estampa'
    });

    // SKU tem muitos registros de Estoque
    SKU.hasMany(models.Estoque, {
      foreignKey: 'sku_id',
      as:         'estoques'
    });

    // SKU tem muitos Precos
    SKU.hasMany(models.Preco, {
      foreignKey: 'sku_id',
      as:         'precos'
    });
  };

  return SKU;
};
