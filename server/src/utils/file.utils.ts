import fs from 'fs/promises';

// Функция удаления файла
export const deleteFile = async (filePath: string): Promise<void> => {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.error(`Ошибка удаления файла ${filePath}:`, error);
  }
}