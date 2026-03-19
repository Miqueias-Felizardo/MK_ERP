const express = require('express');
const cors = require('cors');
const { sequelize } = require('./Models');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

async function iniciarServidor() {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL conectado!');

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });

  } catch (erro) {
    console.error('Erro ao conectar no banco:', erro);
    process.exit(1);
  }
}

iniciarServidor();
