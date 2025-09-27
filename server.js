const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

// ה-Webhook URL של Make
const MAKE_WEBHOOK_URL = 'https://hook.eu1.make.com/dfcb7j2e8w4wr156dpslbxamlbsl9ppe';

app.get('/redirect', async (req, res) => {
  const phone = req.query.phone;

  if (!phone) {
    return res.status(400).send('Missing phone parameter');
  }

  try {
    const response = await fetch(MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone })
    });

    const data = await response.json();

    if (data.redirectUrl) {
      return res.redirect(data.redirectUrl);
    } else {
      return res.status(500).send('No redirectUrl returned from Make');
    }
  } catch (error) {
    console.error('Error calling Make Webhook:', error);
    return res.status(500).send('Error calling Make Webhook');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
