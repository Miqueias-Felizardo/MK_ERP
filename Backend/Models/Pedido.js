'use strict';

module.exports = (sequelize, DataTypes) => {

  const Pedido = sequelize.define('Pedido', {

    id: {
      type:          DataTypes.INTEGER,
      primaryKey:    true,
      autoIncrement: true
    },

    // Número do pedido — gerado pelo sistema
    // Ex: 'PED-2026-0001'
    numero: {
      type:      DataTypes.STRING(20),
      allowNull: false,
      unique:    true
    },

    // FK → clientes
    cliente_id: {
      type:       DataTypes.INTEGER,
      allowNull:  false,
      references: { model: 'clientes', key: 'id' }
    },

    // Fluxo do pedido:
    // ORCAMENTO → CONFIRMADO → FATURADO
    //           ↘ CANCELADO
    status: {
      type:         DataTypes.ENUM('ORCAMENTO','CONFIRMADO','FATURADO','CANCELADO'),
      allowNull:    false,
      defaultValue: 'ORCAMENTO'
    },

    // UF de entrega — pode ser diferente da UF do cliente
    // Determina qual ICMS aplicar
    uf_entrega: {
      type:      DataTypes.CHAR(2),
      allowNull: true
    },

    // Totais calculados a partir dos itens
    total: {
      type:         DataTypes.DECIMAL(10,2),
      allowNull:    false,
      defaultValue: 0
    },

    total_impostos: {
      type:         DataTypes.DECIMAL(10,2),
      allowNull:    false,
      defaultValue: 0
    },

    observacao: {
      type:      DataTypes.TEXT,
      allowNull: true
    }

  }, {
    tableName:   'pedidos',
    timestamps:  true,
    underscored: true
  });

  Pedido.associate = (models) => {
    // Pedido pertence a um Cliente
    Pedido.belongsTo(models.Cliente, {
      foreignKey: 'cliente_id',
      as:         'cliente'
    });

    // Pedido tem muitos Itens
    // CASCADE: ao deletar pedido, deleta os itens também
    Pedido.hasMany(models.PedidoItem, {
      foreignKey: 'pedido_id',
      as:         'itens'
    });
  };

  return Pedido;
};
