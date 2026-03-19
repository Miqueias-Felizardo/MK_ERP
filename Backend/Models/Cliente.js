'use strict';

module.exports = (sequelize, DataTypes) => {

  const Cliente = sequelize.define('Cliente', {

    id: {
      type:          DataTypes.INTEGER,
      primaryKey:    true,
      autoIncrement: true
    },

    nome: {
      type:      DataTypes.STRING(100),
      allowNull: false
    },

    // PF = Pessoa Física, PJ = Pessoa Jurídica
    // Define se usa CPF ou CNPJ
    tipo: {
      type:      DataTypes.ENUM('PF','PJ'),
      allowNull: false
    },

    // CPF (PF) ou CNPJ (PJ) — único por cliente
    cpf_cnpj: {
      type:      DataTypes.STRING(18),
      allowNull: false,
      unique:    true
    },

    email: {
      type:      DataTypes.STRING(100),
      allowNull: true
    },

    telefone: {
      type:      DataTypes.STRING(20),
      allowNull: true
    },

    endereco: {
      type:      DataTypes.STRING(200),
      allowNull: true
    },

    cidade: {
      type:      DataTypes.STRING(100),
      allowNull: true
    },

    // UF do cliente — usado para calcular ICMS no pedido
    uf: {
      type:      DataTypes.CHAR(2),
      allowNull: true
    },

    cep: {
      type:      DataTypes.STRING(9),
      allowNull: true
    },

    ativo: {
      type:         DataTypes.BOOLEAN,
      allowNull:    false,
      defaultValue: true
    }

  }, {
    tableName:   'clientes',
    timestamps:  true,
    underscored: true
  });

  // Cliente tem muitos Pedidos
  Cliente.associate = (models) => {
    Cliente.hasMany(models.Pedido, {
      foreignKey: 'cliente_id',
      as:         'pedidos'
    });
  };

  return Cliente;
};
