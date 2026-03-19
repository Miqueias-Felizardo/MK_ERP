'use strict';

module.exports = (sequelize, DataTypes) => {

  const Categoria = sequelize.define('Categoria', {

    id: {
      type:          DataTypes.INTEGER,
      primaryKey:    true,
      autoIncrement: true
    },

    // Nome da categoria — Ex: 'Camisetas', 'Calçados', 'Eletrônicos'
    nome: {
      type:      DataTypes.STRING(50),
      allowNull: false,
      unique:    true
    },

    descricao: {
      type:      DataTypes.TEXT,
      allowNull: true
    },

    ativo: {
      type:         DataTypes.BOOLEAN,
      allowNull:    false,
      defaultValue: true
    }

  }, {
    tableName:   'categorias',
    timestamps:  true,
    underscored: true
  });

  // Uma Categoria tem muitos Produtos
  Categoria.associate = (models) => {
    Categoria.hasMany(models.Produto, {
      foreignKey: 'categoria_id',
      as:         'produtos'
    });
  };

  return Categoria;
};
