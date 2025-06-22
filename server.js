const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS to allow requests from https://77xxbrasil.com
app.use(cors({
  origin: 'https://77xxbrasil.com',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: false
}));

// Handle preflight OPTIONS requests
app.options('*', cors());

app.use(express.json());

app.post('/proxy', async (req, res) => {
  try {
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbxYojoON2RpbvfayaYcCvpgAB1p2MAk5d_tWRk2fco_uvkMbPIgh8SEomsdCmodb1RJbA/exec';
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
      timeout: 300000 // 5 minutos
    });
    const text = await response.text();
    if (!response.ok) {
      console.error('GAS Response:', text);
      try {
        const data = JSON.parse(text);
        return res.status(response.status).json(data);
      } catch (e) {
        return res.status(response.status).json({ error: 'Invalid response from GAS', rawResponse: text });
      }
    }
    const data = JSON.parse(text);
    res.status(200).json(data);
  } catch (error) {
    console.error('Proxy Error:', error.message, error.stack);
    res.status(500).json({ error: 'Erro ao encaminhar a requisição: ' + error.message });
  }
});

app.get('/', (req, res) => {
  res.status(200).send('Proxy ativo');
});

app.listen(PORT, () => {
  console.log(`Proxy rodando na porta ${PORT}`);
});
