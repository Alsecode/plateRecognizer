import { UploadRequest, ProcessingResult } from './types/upload.types';
import { processPlateRecognition } from '../services/plate-recognition.service';
//import { estimateDistance } from '../services/distance-calculation.service';
import { deleteFile } from '../utils/file.utils';
import { ENV } from '../config/env';
import fs from 'fs/promises';
import sharp from 'sharp';
import path from 'path';
import exifReader from 'exifreader';

export const handleFileUpload = async (req: UploadRequest) => {
  if (!req.file) throw new Error('Файл не был передан');
  
  const originalFilePath = req.file.path;
  const parsedPath = path.parse(originalFilePath);
  // Создание нового пути для сжатого файла
  const compressedFilePath = path.join(parsedPath.dir, `${parsedPath.name}_compressed${parsedPath.ext}`);


  try {
    const originalBuffer = await fs.readFile(originalFilePath);
    const metadata = await sharp(originalBuffer).metadata();
    if (!metadata.height) {
      throw new Error("Не удалось получить высоту изображения");
    }
    const imageHeight: number = metadata.height;

    // Обработка EXIF данных
    let exif: any = null;
    if (metadata.exif) {
      exif = await exifReader.load(originalFilePath);
    }
    
    // Получаем 35mm эквивалент фокусного расстояния из EXIF или используем запасное значение
    const f35: number = exif?.FocalLengthIn35mmFilm?.value ? Number(exif.FocalLengthIn35mmFilm.value) : ENV.ASSUMED_FOCAL_LENGTH;


    // Сжатие изображения
    let compressedBuffer = await sharp(originalBuffer)
      .withMetadata()
      .jpeg({ quality: 70 })
      .toBuffer();



    // Сохранение сжатой версии в отдельный файл
    await fs.writeFile(compressedFilePath, compressedBuffer);

    const plateResult = await processPlateRecognition(compressedFilePath).catch((error) => {
      console.error('Ошибка распознавания:', error);
    });
    const box = plateResult?.results[0].vehicle.box;

    let distance;
    if (box) {
      const carY = box.ymax - box.ymin;
      distance = estimateDistance(f35, carY, ENV.DEFAULT_CAR_HEIGHT, imageHeight);
    }

    return {plateRecognition: plateResult, distanceEstimation: distance};
  } catch (error) {
    console.error('Ошибка:', error);
    throw error;
  } finally {
    // Удаляем оба файла после обработки
    await Promise.allSettled([
      deleteFile(originalFilePath),
      deleteFile(compressedFilePath)
    ]);
  }
};

const estimateDistance = (f35mm: number, carHeight: number, realCarHeight: number, imageHeight: number) => {
  try {  
    // Расчет расстояния:
    // H_mm - высота машины в мм
    const H_mm = realCarHeight * 1000;
    // Предполагаем, что full-frame сенсор имеет физическую высоту 24 мм.
    const fullFrameSensorHeight_mm = 24;
    // Переводим 35mm эквивалент в «пиксельное» фокусное расстояние:
    const f_pixels = (f35mm / fullFrameSensorHeight_mm) * imageHeight;
  
    const distance_mm = (H_mm * f_pixels) / carHeight;
    const distance = distance_mm / 1000 / 2;

    return distance;
  } catch (error) {
    console.error('Ошибка рассчёта расстояния:', error);
  }
}