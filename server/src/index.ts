import express, { Request, Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 5000;

app.use(cors());

const upload = multer({ dest: 'uploads/' });

app.get('/api/hello', (req: Request, res: Response) => {
  res.json({ message: 'Привет с сервера!' });
});

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

app.post(
  '/api/upload',
  upload.single('file'),
  async (req: Request, res: Response): Promise<void> => {
    const multerReq = req as MulterRequest;
    if (!multerReq.file) {
      res.status(400).json({ error: 'Файл не был передан' });
      return;
    }

    const filePath: string = multerReq.file.path;

    try {
      const formData = new FormData();
      formData.append('upload', fs.createReadStream(filePath), {
        filename: multerReq.file.originalname,
      });

      const response = await axios.post(
        'https://api.platerecognizer.com/v1/plate-reader/',
        formData,
        {
          headers: {
            'Authorization': `Token ${process.env.PLATE_RECOGNIZER_API_KEY}`,
            ...formData.getHeaders(),
          },
        }
      );

      res.json(response.data);
    } catch (error: any) {
      console.error('Ошибка при запросе к Plate Recognizer:', error.response?.data || error.message);
      res.status(500).json({ error: 'Ошибка при обработке запроса' });
    } finally {
      fs.unlink(filePath, (err: NodeJS.ErrnoException | null) => {
        if (err) console.error('Ошибка удаления файла:', err);
      });
    }
  }
);

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
