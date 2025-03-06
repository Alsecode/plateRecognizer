export const ENV = {
  PORT: process.env.PORT || 5000,
  PLATE_RECOGNIZER_TOKEN: process.env.PLATE_RECOGNIZER_TOKEN || '781895e92c00e478333db2f3d4cdd298980d77d8',
  ASSUMED_FOCAL_LENGTH: Number(process.env.ASSUMED_FOCAL_LENGTH) || 1000,
  DEFAULT_CAR_HEIGHT: Number(process.env.DEFAULT_CAR_HEIGHT) || 1.5,
} as const;