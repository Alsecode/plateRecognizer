import express from 'express';
import cors from 'cors';

const app = express();
const port = 5000;

app.use(cors());

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Привет с сервера!' });
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});