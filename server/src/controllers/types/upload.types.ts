import { Request } from 'express';
import { PlateRecognitionResult } from '../../services/types/recognition.types';

export interface UploadRequest extends Request {
  file?: Express.Multer.File;
}

export type ProcessingResult = {
  plateRecognition?: PlateRecognitionResult;
  error?: string;
}