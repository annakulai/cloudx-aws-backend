import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.all('/*', async (req, res) => {
  const service = req.originalUrl.split('/')[1];
  const recipientURL = process.env[service];

  if (recipientURL) {
    try {
      const url = `${req.recipientURL}${req.originalUrl}`;

      const response = await fetch(url, {
        method: req.method,
        ...(Object.keys(req.body || {}).length > 0 && { body: req.body }),
      });

      return res.json(response.json());
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        res.status(status).json(data);
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  } else {
    res.status(502).json({ error: 'Cannot process request' });
  }
});

app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
});
