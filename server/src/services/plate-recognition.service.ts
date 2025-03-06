import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { ENV } from '../config/env';
import { PlateRecognitionResult } from './types/recognition.types';

// Вычисление номера машины
export const processPlateRecognition = async (filePath: string): Promise<PlateRecognitionResult> => {
  const formData = new FormData();
  formData.append('upload', fs.createReadStream(filePath));

  console.log(ENV.PLATE_RECOGNIZER_TOKEN);

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