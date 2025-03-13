import { UploadRequest } from './types/upload.types';
import { processPlateRecognition } from '../services/plate-recognition.service';
import { deleteFile } from '../utils/file.utils';
import sharp from 'sharp';

// Обработка загрузки файла
export const handleFileUpload = async (req: UploadRequest) => {
  if (!req.file) {
    throw new Error('Файл не был передан');
  }

  try {
    // Сжатие файла
    const compressedBuffer = await sharp(req.file.path)
      .rotate()
      .resize({
        width: 1280,
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({
        mozjpeg: true,
        quality: 30,
        chromaSubsampling: '4:2:0'
      })
      .toBuffer();

    // Распознавание номера
    const plateResult = await processPlateRecognition(compressedBuffer).catch((error) => {
      console.error('Ошибка распознавания:', error);
    });

    return { plateRecognition: plateResult };
  } catch (error) {
    console.error('Ошибка:', error);
    throw error;
  } finally {
    // Удаление файла
    await deleteFile(req.file.path);
  }
}
