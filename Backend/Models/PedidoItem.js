'use strict';

module.exports = (sequelize, DataTypes) => {

  const PedidoItem = sequelize.define('PedidoItem', {

    id: {
      type:          DataTypes.INTEGER,
      primaryKey:    true,
      autoIncrement: true
    },

    // FK → pedidos
    pedido_id: {
      type:       DataTypes.INTEGER,
      allowNull:  false,
      references: { model: 'pedidos', key: 'id' }
    },

    // FK → skus — item sempre referencia um SKU específico
    sku_id: {
      type:       DataTypes.INTEGER,
      allowNull:  false,
      references: { model: 'skus', key: 'id' }
    },

    quantidade: {
      type:      DataTypes.DECIMAL(10,3),
      allowNull: false
    },

    // Preço gravado no momento da venda
    // IMPORTANTE: não usar FK para precos — o preço pode
    // mudar depois, mas o valor do pedido deve ser preservado
    preco_unitario: {
      type:      DataTypes.DECIMAL(10,2),
      allowNull: false
    },

    // Impostos gravados no momento da venda
    icms:   { type: DataTypes.DECIMAL(5,2), defaultValue: 0 },
    pis:    { type: DataTypes.DECIMAL(5,2), defaultValue: 0 },
    cofins: { type: DataTypes.DECIMAL(5,2), defaultValue: 0 },
    ipi:    { type: DataTypes.DECIMAL(5,2), defaultValue: 0 },

    // subtotal = quantidade x preco_unitario
    subtotal: {
      type:      DataTypes.DECIMAL(10,2),
      allowNull: false
    }

  }, {
    tableName:   'pedido_itens',
    timestamps:  true,
    underscored: true
  });

  PedidoItem.associate = (models) => {
    // Item pertence a um Pedido
    PedidoItem.belongsTo(models.Pedido, {
      foreignKey: 'pedido_id',
      as:         'pedido'
    });

    // Item referencia um SKU
    PedidoItem.belongsTo(models.SKU, {
      foreignKey: 'sku_id',
      as:         'sku'
    });
  };

  return PedidoItem;
};
