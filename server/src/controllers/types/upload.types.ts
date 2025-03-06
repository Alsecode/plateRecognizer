import { Request } from 'express';
import { PlateRecognitionResult } from '../../services/types/recognition.types';
import { DistanceEstimationResult } from '../../services/types/distance.types';

export interface UploadRequest extends Request {
  file?: Express.Multer.File;
}

export type ProcessingResult = {
  plateRecognition?: PlateRecognitionResult;
  distanceEstimation?: DistanceEstimationResult;
  error?: string;
}