import sharp from 'sharp';
import exifReader from 'exifreader';
import * as tf from '@tensorflow/tfjs-node';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import { DistanceEstimationResult } from './types/distance.types';

export const estimateDistance = async (
  filePath: string,
  assumedF35FocalLength: number,
  realCarHeight: number
): Promise<DistanceEstimationResult> => {
  // Чтение метаданных изображения
  const metadata = await sharp(filePath).metadata();
  if (!metadata.height) {
    throw new Error("Не удалось получить высоту изображения");
  }
  const imageHeight: number = metadata.height;
  
  // Обработка EXIF данных
  let exif: any = null;
  if (metadata.exif) {
    exif = await exifReader.load(filePath);
  }

  //console.log(JSON.stringify(exif));

   // Получаем 35mm эквивалент фокусного расстояния из EXIF или используем запасное значение
   const f35: number = exif?.FocalLengthIn35mmFilm?.value 
   ? Number(exif.FocalLengthIn35mmFilm.value)
   : assumedF35FocalLength;

  // Обнаружение машины на изображении
  const bbox = await detectCar(filePath); // bbox.height в пикселях

  // Расчет расстояния:
  // H_mm - высота машины в мм
  const H_mm = realCarHeight * 1000;
  // Предполагаем, что full-frame сенсор имеет физическую высоту 24 мм.
  const fullFrameSensorHeight_mm = 24;
  // Переводим 35mm эквивалент в «пиксельное» фокусное расстояние:
  const f_pixels = (f35 / fullFrameSensorHeight_mm) * imageHeight;

  const distance_mm = (H_mm * f_pixels) / bbox.height;
  const distance = distance_mm / 1000;
  
  return {
    distance,
    coordinates: null,
  };
};

const detectCar = async (filePath: string): Promise<{ height: number }> => {
  try {
    // Инициализация TensorFlow
    await tf.ready();
      
    let model;
    try {
      model = await cocoSsd.load();
      console.log("Модель coco-ssd загружена успешно!");
    } catch (e) {
      console.error("Не удалось загрузить модель coco-ssd:", e);
      throw e;
    }

    // Подготовка изображения
    const buffer = await sharp(filePath)
      .toFormat('png')
      .toBuffer();

    // Декодирование тензора
    const imageTensor = tf.node.decodeImage(buffer, 3) as tf.Tensor3D;

    // Обнаружение объектов
    const predictions = await model.detect(imageTensor);
    console.log('Все предсказания:', predictions);

    // Поиск машины
    const car = predictions.find(p => p.class === 'car');
    imageTensor.dispose();

    if (!car) throw new Error('Машина не найдена на изображении');

    // bbox в виде [x, y, width, height]
    return { height: car.bbox[3] };
  } catch (error) {
    throw new Error(`Ошибка детекции: ${error}`);
  }
};