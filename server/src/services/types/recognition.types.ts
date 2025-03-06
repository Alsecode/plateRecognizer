export type PlateRecognitionResult = {
  results: Array<{
    plate: string;
    confidence: number;
    box: { 
      [key: string]: number
    };
    vehicle: {
      box: {
        [key: string]: number
      }
    }
  }>
}