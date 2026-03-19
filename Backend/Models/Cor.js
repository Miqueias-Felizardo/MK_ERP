'use strict';

// ===================================================
// MODEL DE COR
// Define a estrutura da tabela 'cores' no PostgreSQL.
// ===================================================

module.exports = (sequelize, DataTypes) => {

  const Cor = sequelize.define('Cor', {

    id: {
      type:          DataTypes.INTEGER,
      primaryKey:    true,
      autoIncrement: true
    },

    // Nome da cor — Ex: 'Azul', 'Vermelho', 'Preto'
    nome: {
      type:      DataTypes.STRING(50),
      allowNull: false,
      unique:    true
    },

    // Código hexadecimal para exibir a cor visualmente
    // Ex: '#0000FF' para azul
    hexadecimal: {
      type:      DataTypes.STRING(7),
      allowNull: true
    },

    // Ativo = false significa desativado mas mantém histórico
    // Boa prática: nunca deletar registros, apenas desativar
    ativo: {
      type:         DataTypes.BOOLEAN,
      allowNull:    false,
      defaultValue: true
    }

  }, {
    tableName:   'cores',
    timestamps:  true,
    underscored: true  // created_at e updated_at no padrão SQL
  });

  // Relacionamentos serão adicionados quando o Model SKU existir
  Cor.associate = (models) => {};

  return Cor;
};
