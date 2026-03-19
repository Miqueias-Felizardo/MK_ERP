'use strict';

// ===================================================
// MIGRATION — CRIAÇÃO COMPLETA DO BANCO MK_ERP
// ===================================================
// O que é uma Migration?
// É um arquivo que controla mudanças no banco de dados.
// Funciona como um "histórico de versões" do banco.
//
// Cada migration tem dois métodos:
// up()   → aplica as mudanças (criar tabelas, colunas etc)
// down() → desfaz as mudanças (usado para rollback)
//
// Para executar:  npx sequelize-cli db:migrate
// Para desfazer: npx sequelize-cli db:migrate:undo
// ===================================================

module.exports = {

  // -----------------------------------------------
  // UP — cria toda a estrutura do banco
  // A ordem importa! Tabelas com FK devem ser
  // criadas depois das tabelas que elas referenciam.
  // -----------------------------------------------
  async up(queryInterface, Sequelize) {

    // -----------------------------------------------
    // 1. TABELAS DE DOMÍNIO
    // São independentes — não referenciam ninguém
    // -----------------------------------------------

    // Tabela: cores
    await queryInterface.createTable('cores', {
      id: {
        type:          Sequelize.INTEGER,
        primaryKey:    true,
        autoIncrement: true,
        comment:       'Identificador único da cor'
      },
      nome: {
        type:      Sequelize.STRING(50),
        allowNull: false,
        unique:    true,
        comment:   'Nome da cor — Ex: Azul, Vermelho'
      },
      hexadecimal: {
        type:      Sequelize.STRING(7),
        allowNull: true,
        comment:   'Código hex para exibição visual — Ex: #0000FF'
      },
      ativo: {
        type:         Sequelize.BOOLEAN,
        allowNull:    false,
        defaultValue: true
      },
      created_at: {
        type:      Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type:      Sequelize.DATE,
        allowNull: false
      }
    });

    // Tabela: tamanhos
    await queryInterface.createTable('tamanhos', {
      id: {
        type:          Sequelize.INTEGER,
        primaryKey:    true,
        autoIncrement: true
      },
      nome: {
        type:      Sequelize.STRING(20),
        allowNull: false,
        unique:    true,
        comment:   'Nome do tamanho — Ex: P, M, G, 42'
      },
      ordem: {
        type:         Sequelize.INTEGER,
        allowNull:    false,
        defaultValue: 0,
        comment:      'Ordem de exibição — P=1, M=2, G=3...'
      },
      tipo: {
        type:         Sequelize.STRING(30),
        allowNull:    false,
        defaultValue: 'GERAL',
        comment:      'Tipo — ROUPA, CALCADO, VOLUME, GERAL'
      },
      ativo: {
        type:         Sequelize.BOOLEAN,
        allowNull:    false,
        defaultValue: true
      },
      created_at: {
        type:      Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type:      Sequelize.DATE,
        allowNull: false
      }
    });

    // Tabela: estampas
    await queryInterface.createTable('estampas', {
      id: {
        type:          Sequelize.INTEGER,
        primaryKey:    true,
        autoIncrement: true
      },
      nome: {
        type:      Sequelize.STRING(50),
        allowNull: false,
        unique:    true,
        comment:   'Nome da estampa — Ex: Listrado, Xadrez, Liso'
      },
      descricao: {
        type:      Sequelize.TEXT,
        allowNull: true
      },
      imagem_url: {
        type:      Sequelize.STRING(255),
        allowNull: true,
        comment:   'URL da imagem de preview da estampa'
      },
      ativo: {
        type:         Sequelize.BOOLEAN,
        allowNull:    false,
        defaultValue: true
      },
      created_at: {
        type:      Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type:      Sequelize.DATE,
        allowNull: false
      }
    });

    // Tabela: categorias
    await queryInterface.createTable('categorias', {
      id: {
        type:          Sequelize.INTEGER,
        primaryKey:    true,
        autoIncrement: true
      },
      nome: {
        type:      Sequelize.STRING(50),
        allowNull: false,
        unique:    true,
        comment:   'Nome da categoria — Ex: Camisetas, Calcados'
      },
      descricao: {
        type:      Sequelize.TEXT,
        allowNull: true
      },
      ativo: {
        type:         Sequelize.BOOLEAN,
        allowNull:    false,
        defaultValue: true
      },
      created_at: {
        type:      Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type:      Sequelize.DATE,
        allowNull: false
      }
    });

    // -----------------------------------------------
    // 2. TABELAS PRINCIPAIS
    // -----------------------------------------------

    // Tabela: produtos
    await queryInterface.createTable('produtos', {
      id: {
        type:          Sequelize.INTEGER,
        primaryKey:    true,
        autoIncrement: true
      },
      codigo: {
        type:      Sequelize.STRING(30),
        allowNull: false,
        unique:    true,
        comment:   'Código interno — Ex: CAM-001'
      },
      nome: {
        type:      Sequelize.STRING(100),
        allowNull: false
      },
      descricao: {
        type:      Sequelize.TEXT,
        allowNull: true
      },
      unidade: {
        type:         Sequelize.ENUM('UN','KG','LT','CX','MT'),
        allowNull:    false,
        defaultValue: 'UN',
        comment:      'Unidade de medida do produto'
      },
      categoria_id: {
        type:       Sequelize.INTEGER,
        allowNull:  true,
        // FK → categorias
        // ON DELETE SET NULL: se a categoria for deletada,
        // o produto não é deletado — categoria_id vira null
        references: { model: 'categorias', key: 'id' },
        onDelete:   'SET NULL',
        onUpdate:   'CASCADE'
      },
      ativo: {
        type:         Sequelize.BOOLEAN,
        allowNull:    false,
        defaultValue: true
      },
      created_at: {
        type:      Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type:      Sequelize.DATE,
        allowNull: false
      }
    });

    // Tabela: skus
    // Depende de: produtos, cores, tamanhos, estampas
    await queryInterface.createTable('skus', {
      id: {
        type:          Sequelize.INTEGER,
        primaryKey:    true,
        autoIncrement: true
      },
      codigo: {
        type:      Sequelize.STRING(50),
        allowNull: false,
        unique:    true,
        comment:   'Código único do SKU — Ex: CAM-001-AZ-M'
      },
      produto_id: {
        type:       Sequelize.INTEGER,
        allowNull:  false,
        // FK → produtos
        // ON DELETE RESTRICT: não deixa deletar produto
        // que tenha SKUs cadastrados — protege integridade
        references: { model: 'produtos', key: 'id' },
        onDelete:   'RESTRICT',
        onUpdate:   'CASCADE'
      },
      cor_id: {
        type:       Sequelize.INTEGER,
        allowNull:  true,
        references: { model: 'cores', key: 'id' },
        onDelete:   'SET NULL',
        onUpdate:   'CASCADE'
      },
      tamanho_id: {
        type:       Sequelize.INTEGER,
        allowNull:  true,
        references: { model: 'tamanhos', key: 'id' },
        onDelete:   'SET NULL',
        onUpdate:   'CASCADE'
      },
      estampa_id: {
        type:       Sequelize.INTEGER,
        allowNull:  true,
        references: { model: 'estampas', key: 'id' },
        onDelete:   'SET NULL',
        onUpdate:   'CASCADE'
      },
      ean13: {
        type:      Sequelize.STRING(13),
        allowNull: true,
        unique:    true,
        comment:   'Código de barras EAN-13'
      },
      ncm: {
        type:      Sequelize.STRING(10),
        allowNull: true,
        comment:   'Código fiscal NCM obrigatório em notas fiscais'
      },
      peso: {
        type:         Sequelize.DECIMAL(10,3),
        allowNull:    false,
        defaultValue: 0,
        comment:      'Peso em kg — usado para cálculo de frete'
      },
      altura: {
        type:         Sequelize.DECIMAL(10,2),
        allowNull:    false,
        defaultValue: 0,
        comment:      'Altura em cm'
      },
      largura: {
        type:         Sequelize.DECIMAL(10,2),
        allowNull:    false,
        defaultValue: 0
      },
      comprimento: {
        type:         Sequelize.DECIMAL(10,2),
        allowNull:    false,
        defaultValue: 0
      },
      ativo: {
        type:         Sequelize.BOOLEAN,
        allowNull:    false,
        defaultValue: true
      },
      created_at: {
        type:      Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type:      Sequelize.DATE,
        allowNull: false
      }
    });

    // Tabela: estoques
    // Depende de: skus
    await queryInterface.createTable('estoques', {
      id: {
        type:          Sequelize.INTEGER,
        primaryKey:    true,
        autoIncrement: true
      },
      sku_id: {
        type:       Sequelize.INTEGER,
        allowNull:  false,
        references: { model: 'skus', key: 'id' },
        onDelete:   'RESTRICT',
        onUpdate:   'CASCADE'
      },
      deposito: {
        type:         Sequelize.STRING(50),
        allowNull:    false,
        defaultValue: 'PRINCIPAL',
        comment:      'Nome do depósito — base para WMS futuro'
      },
      localizacao: {
        type:         Sequelize.STRING(50),
        allowNull:    false,
        defaultValue: 'GERAL',
        comment:      'Posição no depósito — Ex: A1, PRATELEIRA-2'
      },
      quantidade: {
        type:         Sequelize.DECIMAL(10,3),
        allowNull:    false,
        defaultValue: 0
      },
      estoque_minimo: {
        type:         Sequelize.DECIMAL(10,3),
        allowNull:    false,
        defaultValue: 0,
        comment:      'Quantidade mínima antes de gerar alerta'
      },
      created_at: {
        type:      Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type:      Sequelize.DATE,
        allowNull: false
      }
    });

    // Índice único — evita duplicidade de SKU no mesmo depósito/localização
    await queryInterface.addIndex('estoques', ['sku_id', 'deposito', 'localizacao'], {
      unique: true,
      name:   'unique_estoque_sku_deposito_localizacao'
    });

    // Tabela: precos
    // Depende de: skus
    await queryInterface.createTable('precos', {
      id: {
        type:          Sequelize.INTEGER,
        primaryKey:    true,
        autoIncrement: true
      },
      sku_id: {
        type:       Sequelize.INTEGER,
        allowNull:  false,
        references: { model: 'skus', key: 'id' },
        onDelete:   'RESTRICT',
        onUpdate:   'CASCADE'
      },
      tabela: {
        type:         Sequelize.STRING(30),
        allowNull:    false,
        defaultValue: 'PADRAO',
        comment:      'Nome da tabela de preço — Ex: VAREJO, ATACADO'
      },
      uf: {
        type:         Sequelize.CHAR(2),
        allowNull:    false,
        defaultValue: 'TODOS',
        comment:      'UF de aplicação — TODOS vale para qualquer estado'
      },
      preco_venda: {
        type:      Sequelize.DECIMAL(10,2),
        allowNull: false
      },
      preco_custo: {
        type:         Sequelize.DECIMAL(10,2),
        allowNull:    false,
        defaultValue: 0
      },
      // Impostos separados para relatórios fiscais
      icms: {
        type:         Sequelize.DECIMAL(5,2),
        allowNull:    false,
        defaultValue: 0,
        comment:      'Percentual ICMS — varia por estado'
      },
      pis: {
        type:         Sequelize.DECIMAL(5,2),
        allowNull:    false,
        defaultValue: 0
      },
      cofins: {
        type:         Sequelize.DECIMAL(5,2),
        allowNull:    false,
        defaultValue: 0
      },
      ipi: {
        type:         Sequelize.DECIMAL(5,2),
        allowNull:    false,
        defaultValue: 0
      },
      vigencia_inicio: {
        type:         Sequelize.DATEONLY,
        allowNull:    false,
        defaultValue: Sequelize.NOW,
        comment:      'Data de início da vigência do preço'
      },
      vigencia_fim: {
        type:      Sequelize.DATEONLY,
        allowNull: true,
        comment:   'Data fim — null significa sem prazo de validade'
      },
      ativo: {
        type:         Sequelize.BOOLEAN,
        allowNull:    false,
        defaultValue: true
      },
      created_at: {
        type:      Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type:      Sequelize.DATE,
        allowNull: false
      }
    });

    // -----------------------------------------------
    // 3. TABELAS TRANSACIONAIS
    // -----------------------------------------------

    // Tabela: clientes
    await queryInterface.createTable('clientes', {
      id: {
        type:          Sequelize.INTEGER,
        primaryKey:    true,
        autoIncrement: true
      },
      nome: {
        type:      Sequelize.STRING(100),
        allowNull: false
      },
      tipo: {
        type:      Sequelize.ENUM('PF','PJ'),
        allowNull: false,
        comment:   'PF = Pessoa Física, PJ = Pessoa Jurídica'
      },
      cpf_cnpj: {
        type:      Sequelize.STRING(18),
        allowNull: false,
        unique:    true,
        comment:   'CPF (PF) ou CNPJ (PJ) — único por cliente'
      },
      email: {
        type:      Sequelize.STRING(100),
        allowNull: true
      },
      telefone: {
        type:      Sequelize.STRING(20),
        allowNull: true
      },
      endereco: {
        type:      Sequelize.STRING(200),
        allowNull: true
      },
      cidade: {
        type:      Sequelize.STRING(100),
        allowNull: true
      },
      uf: {
        type:      Sequelize.CHAR(2),
        allowNull: true,
        comment:   'UF do cliente — usado para calcular ICMS no pedido'
      },
      cep: {
        type:      Sequelize.STRING(9),
        allowNull: true
      },
      ativo: {
        type:         Sequelize.BOOLEAN,
        allowNull:    false,
        defaultValue: true
      },
      created_at: {
        type:      Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type:      Sequelize.DATE,
        allowNull: false
      }
    });

    // Tabela: pedidos
    // Depende de: clientes
    await queryInterface.createTable('pedidos', {
      id: {
        type:          Sequelize.INTEGER,
        primaryKey:    true,
        autoIncrement: true
      },
      numero: {
        type:      Sequelize.STRING(20),
        allowNull: false,
        unique:    true,
        comment:   'Número do pedido — Ex: PED-2026-0001'
      },
      cliente_id: {
        type:       Sequelize.INTEGER,
        allowNull:  false,
        references: { model: 'clientes', key: 'id' },
        onDelete:   'RESTRICT',
        onUpdate:   'CASCADE'
      },
      status: {
        type:         Sequelize.ENUM('ORCAMENTO','CONFIRMADO','FATURADO','CANCELADO'),
        allowNull:    false,
        defaultValue: 'ORCAMENTO',
        comment:      'Status do pedido no fluxo comercial'
      },
      uf_entrega: {
        type:      Sequelize.CHAR(2),
        allowNull: true,
        comment:   'UF de entrega — pode ser diferente do cliente'
      },
      total: {
        type:         Sequelize.DECIMAL(10,2),
        allowNull:    false,
        defaultValue: 0
      },
      total_impostos: {
        type:         Sequelize.DECIMAL(10,2),
        allowNull:    false,
        defaultValue: 0
      },
      observacao: {
        type:      Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        type:      Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type:      Sequelize.DATE,
        allowNull: false
      }
    });

    // Tabela: pedido_itens
    // Depende de: pedidos, skus
    await queryInterface.createTable('pedido_itens', {
      id: {
        type:          Sequelize.INTEGER,
        primaryKey:    true,
        autoIncrement: true
      },
      pedido_id: {
        type:       Sequelize.INTEGER,
        allowNull:  false,
        references: { model: 'pedidos', key: 'id' },
        // CASCADE: se o pedido for deletado, os itens também são
        onDelete:   'CASCADE',
        onUpdate:   'CASCADE'
      },
      sku_id: {
        type:       Sequelize.INTEGER,
        allowNull:  false,
        references: { model: 'skus', key: 'id' },
        onDelete:   'RESTRICT',
        onUpdate:   'CASCADE'
      },
      quantidade: {
        type:      Sequelize.DECIMAL(10,3),
        allowNull: false
      },
      preco_unitario: {
        type:      Sequelize.DECIMAL(10,2),
        allowNull: false,
        comment:   'Preço no momento da venda — não muda se o preço mudar depois'
      },
      icms: {
        type:         Sequelize.DECIMAL(5,2),
        allowNull:    false,
        defaultValue: 0
      },
      pis: {
        type:         Sequelize.DECIMAL(5,2),
        allowNull:    false,
        defaultValue: 0
      },
      cofins: {
        type:         Sequelize.DECIMAL(5,2),
        allowNull:    false,
        defaultValue: 0
      },
      ipi: {
        type:         Sequelize.DECIMAL(5,2),
        allowNull:    false,
        defaultValue: 0
      },
      subtotal: {
        type:      Sequelize.DECIMAL(10,2),
        allowNull: false,
        comment:   'quantidade x preco_unitario'
      },
      created_at: {
        type:      Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type:      Sequelize.DATE,
        allowNull: false
      }
    });

  },

  // -----------------------------------------------
  // DOWN — desfaz tudo que o UP fez
  // A ordem é inversa — remove as tabelas que
  // têm FKs primeiro para não violar integridade
  // -----------------------------------------------
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('pedido_itens');
    await queryInterface.dropTable('pedidos');
    await queryInterface.dropTable('clientes');
    await queryInterface.dropTable('precos');
    await queryInterface.dropTable('estoques');
    await queryInterface.dropTable('skus');
    await queryInterface.dropTable('produtos');
    await queryInterface.dropTable('categorias');
    await queryInterface.dropTable('estampas');
    await queryInterface.dropTable('tamanhos');
    await queryInterface.dropTable('cores');
  }
};
