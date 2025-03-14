import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import { ENV } from './config/env';
import { handleFileUpload } from './controllers/upload.controller';
import { UploadRequest } from './controllers/types/upload.types';

dotenv.config();

const app = express();
const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

const upload = multer({ dest: 'uploads/' });

app.use(cors());

app.post(
  '/api/upload',
  upload.single('file'),
  async (req: UploadRequest, res) => {
    try {
      const result = await handleFileUpload(req);
      res.json(result);
    } catch (error) {
      console.error('Ошибка обработки файла:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Неизвестная ошибка'
      });
    }
  }
);

app.listen(port, '0.0.0.0', () => {
  console.log(`Сервер запущен на порту ${port}`);
});
