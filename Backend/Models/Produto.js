'use strict';

module.exports = (sequelize, DataTypes) => {

  const Produto = sequelize.define('Produto', {

    id: {
      type:          DataTypes.INTEGER,
      primaryKey:    true,
      autoIncrement: true
    },

    // Código interno — Ex: 'CAM-001', 'ELE-TV-001'
    codigo: {
      type:      DataTypes.STRING(30),
      allowNull: false,
      unique:    true
    },

    nome: {
      type:      DataTypes.STRING(100),
      allowNull: false
    },

    descricao: {
      type:      DataTypes.TEXT,
      allowNull: true
    },

    // Unidade de medida
    // UN=unidade, KG=quilo, LT=litro, CX=caixa, MT=metro
    unidade: {
      type:         DataTypes.ENUM('UN','KG','LT','CX','MT'),
      allowNull:    false,
      defaultValue: 'UN'
    },

    // FK para categorias
    categoria_id: {
      type:       DataTypes.INTEGER,
      allowNull:  true,
      references: { model: 'categorias', key: 'id' }
    },

    ativo: {
      type:         DataTypes.BOOLEAN,
      allowNull:    false,
      defaultValue: true
    }

  }, {
    tableName:   'produtos',
    timestamps:  true,
    underscored: true
  });

  Produto.associate = (models) => {
    // Produto pertence a uma Categoria
    Produto.belongsTo(models.Categoria, {
      foreignKey: 'categoria_id',
      as:         'categoria'
    });

    // Produto tem muitos SKUs
    Produto.hasMany(models.SKU, {
      foreignKey: 'produto_id',
      as:         'skus'
    });
  };

  return Produto;
};
