'use strict';

module.exports = (sequelize, DataTypes) => {

  const Tamanho = sequelize.define('Tamanho', {

    id: {
      type:          DataTypes.INTEGER,
      primaryKey:    true,
      autoIncrement: true
    },

    // Nome do tamanho — Ex: 'P', 'M', 'G', '42', '100ml'
    nome: {
      type:      DataTypes.STRING(20),
      allowNull: false,
      unique:    true
    },

    // Ordem de exibição — garante que P apareça antes de M, G, GG
    // Ex: P=1, M=2, G=3, GG=4
    ordem: {
      type:         DataTypes.INTEGER,
      allowNull:    false,
      defaultValue: 0
    },

    // Tipo de tamanho — permite filtrar por categoria
    // Ex: 'ROUPA', 'CALÇADO', 'VOLUME', 'COMPRIMENTO'
    tipo: {
      type:         DataTypes.STRING(30),
      allowNull:    false,
      defaultValue: 'GERAL'
    },

    ativo: {
      type:         DataTypes.BOOLEAN,
      allowNull:    false,
      defaultValue: true
    }

  }, {
    tableName:   'tamanhos',
    timestamps:  true,
    underscored: true
  });

  Tamanho.associate = (models) => {};

  return Tamanho;
};
