const express = require('express');
const bodyParser = require('body-parser');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// Trang Mini App UI
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// API gửi về n8n
app.post('/api/n8n', async (req, res) => {
  const payload = req.body;
  try {
    const resp = await fetch('https://kimun0608.app.n8n.cloud/webhook-test/05a82975-4179-4411-aa33-0671f10d4eb7/webhook', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload)
    });
    const text = await resp.text();
    res.json({ ok: true, n8n: text });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.listen(PORT, () => console.log('Server running on port', PORT));
