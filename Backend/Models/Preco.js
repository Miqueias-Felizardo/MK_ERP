'use strict';

module.exports = (sequelize, DataTypes) => {

  const Preco = sequelize.define('Preco', {

    id: {
      type:          DataTypes.INTEGER,
      primaryKey:    true,
      autoIncrement: true
    },

    // FK → skus — preço é sempre de um SKU específico
    sku_id: {
      type:       DataTypes.INTEGER,
      allowNull:  false,
      references: { model: 'skus', key: 'id' }
    },

    // Tabela de preço — Ex: 'VAREJO', 'ATACADO', 'DISTRIBUIDOR'
    tabela: {
      type:         DataTypes.STRING(30),
      allowNull:    false,
      defaultValue: 'PADRAO'
    },

    // UF de aplicação do preço
    // 'TODOS' = vale para qualquer estado
    // 'SP', 'RJ' = preço específico para aquele estado
    uf: {
      type:         DataTypes.CHAR(2),
      allowNull:    false,
      defaultValue: 'TO' // TODOS
    },

    preco_venda: {
      type:      DataTypes.DECIMAL(10,2),
      allowNull: false
    },

    // Custo — usado para calcular margem de lucro
    preco_custo: {
      type:         DataTypes.DECIMAL(10,2),
      allowNull:    false,
      defaultValue: 0
    },

    // -----------------------------------------------
    // IMPOSTOS — separados para relatórios fiscais
    // -----------------------------------------------

    // ICMS — varia por estado (SP=18%, RJ=20%...)
    icms: {
      type:         DataTypes.DECIMAL(5,2),
      allowNull:    false,
      defaultValue: 0
    },

    // PIS — 0,65% regime cumulativo ou 1,65% não cumulativo
    pis: {
      type:         DataTypes.DECIMAL(5,2),
      allowNull:    false,
      defaultValue: 0
    },

    // COFINS — 3% regime cumulativo ou 7,6% não cumulativo
    cofins: {
      type:         DataTypes.DECIMAL(5,2),
      allowNull:    false,
      defaultValue: 0
    },

    // IPI — aplicável a produtos industrializados
    ipi: {
      type:         DataTypes.DECIMAL(5,2),
      allowNull:    false,
      defaultValue: 0
    },

    // Vigência — permite controlar promoções e reajustes
    vigencia_inicio: {
      type:         DataTypes.DATEONLY,
      allowNull:    false,
      defaultValue: DataTypes.NOW
    },

    // null = sem prazo de validade
    vigencia_fim: {
      type:      DataTypes.DATEONLY,
      allowNull: true
    },

    ativo: {
      type:         DataTypes.BOOLEAN,
      allowNull:    false,
      defaultValue: true
    }

  }, {
    tableName:   'precos',
    timestamps:  true,
    underscored: true
  });

  Preco.associate = (models) => {
    Preco.belongsTo(models.SKU, {
      foreignKey: 'sku_id',
      as:         'sku'
    });
  };

  return Preco;
};
