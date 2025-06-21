const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'https://77xxbrasil.com' }));
app.use(express.json());

app.post('/proxy', async (req, res) => {
  try {
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbxRojoON2RpbvfayaYcCvvrAB1p2MAk5d_tQzM2NcoO1uMkM2kgh8qSEomsDmodb1RJbA/exec';
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
      timeout: 12000
    });
    const data = await response.json();
    if (!response.ok) {
      console.error('GAS Error:', data);
      return res.status(response.status).json(data);
    }
    res.status(200).json(data);
  } catch (error) {
    console.error('Proxy Error:', error.message);
    res.status(500).json({ error: 'Erro ao encaminhar a requisição: ' + error.message });
  }
});

app.get('/', (req, res) => {
  res.status(200).send('Proxy ativo');
});

app.listen(PORT, () => {
  console.log(`Proxy rodando na porta ${PORT}`);
});
