import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors'; // <- importar cors
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 3000;
const GOOGLE_SHEETS_URL = process.env.GOOGLE_SHEETS_URL;

if (!GOOGLE_SHEETS_URL) {
  throw new Error('GOOGLE_SHEETS_URL não definida no .env');
}

const app = express();

// Permitir todas as origens (dev)
app.use(cors()); // <- ADICIONE ISSO
app.use(express.json());

app.post('/sync', async (req, res) => {
  try {
    const bodyToSend = {
      caixas: Array.isArray(req.body.caixas) ? req.body.caixas : [],
      pontas: Array.isArray(req.body.pontas) ? req.body.pontas : [],
    };

    const response = await fetch(GOOGLE_SHEETS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyToSend),
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { status: 'erro', message: 'Google retornou HTML ou não JSON' };
    }

    res.json(data);
  } catch (err) {
    console.error('Erro real:', err);
    res.status(500).json({ error: 'Falha ao sincronizar com Google Sheets' });
  }
});

app.get('/sync', async (req, res) => {
  try {
    const response = await fetch(GOOGLE_SHEETS_URL);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar dados do Sheets' });
  }
});

app.get('/', (req, res) => {
  res.send('Servidor rodando! Use POST /sync');
});

app.listen(PORT, () => {
  console.log(`Backend rondando na porta ${PORT}.`);
});
