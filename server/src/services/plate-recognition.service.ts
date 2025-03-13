import axios from 'axios';
import FormData from 'form-data';
import { ENV } from '../config/env';
import { PlateRecognitionResult } from './types/recognition.types';

// Распознавание номера по внешнему API
export const processPlateRecognition = async (fileBuffer: Buffer): Promise<PlateRecognitionResult> => {
  // Создание формы с картинкой
  const formData = new FormData();
  formData.append('upload', fileBuffer, {
    filename: 'image.jpg',
    contentType: 'image/jpeg'
  });

  const response = await axios.post(
    'https://api.platerecognizer.com/v1/plate-reader/',
    formData,
    {
      headers: {
        Authorization: `Token ${ENV.PLATE_RECOGNIZER_TOKEN}`,
        ...formData.getHeaders(),
      },
    }
  );
  return response.data;
}