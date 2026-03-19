'use strict';

module.exports = (sequelize, DataTypes) => {

  const Estampa = sequelize.define('Estampa', {

    id: {
      type:          DataTypes.INTEGER,
      primaryKey:    true,
      autoIncrement: true
    },

    // Nome da estampa — Ex: 'Listrado', 'Xadrez', 'Liso'
    nome: {
      type:      DataTypes.STRING(50),
      allowNull: false,
      unique:    true
    },

    // Descrição detalhada da estampa
    descricao: {
      type:      DataTypes.TEXT, // TEXT = sem limite de caracteres
      allowNull: true
    },

    // URL da imagem de preview da estampa
    // Será útil para exibir no frontend
    imagem_url: {
      type:      DataTypes.STRING(255),
      allowNull: true
    },

    ativo: {
      type:         DataTypes.BOOLEAN,
      allowNull:    false,
      defaultValue: true
    }

  }, {
    tableName:   'estampas',
    timestamps:  true,
    underscored: true
  });

  Estampa.associate = (models) => {};

  return Estampa;
};
