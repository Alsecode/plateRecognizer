import React, { useRef, useState } from 'react';
import * as classes from './FileUpload.module.scss';

interface FileUploadProps {
  className?: string;
  onFileChange: (file: File | null) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ className, onFileChange }) => {
  // Файл
  const fileInput = useRef<HTMLInputElement | null>(null);
  // Изображение (превью)
  const [preview, setPreview] = useState<string | null>(null);
  // Активно ли перетаскивание файла
  const [isDragActive, setIsDragActive] = useState(false);
  // Текст ошибки
  const [error, setError] = useState<string>('');

  // Обработка нажатия на загрузку файла
  const triggerFileInput = () => {
    fileInput.current?.click();
  };

  // Обработка загрузки файла
  const handleFile = (files: FileList) => {
    if (files && files.length > 0) {
      // Проверка на количество файлов
      if (files.length > 1) {
        setError('Можно загрузить только одно изображение.');
        return;
      }

      const file = files[0];

      // Проверка на то, что файл - изображение
      if (!file.type.startsWith('image/')) {
        setError('Пожалуйста, выберите изображение.');
        return;
      }

      // Создание URL для превью
      setPreview(URL.createObjectURL(file));
      // Обнуление ошибки
      setError('');
      // Передача файла родителю
      onFileChange(file);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  // Обработчик события отпускания файла (drop)
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    handleFile(e.dataTransfer.files);
  };

  // Обработчик события перетаскивания (dragover)
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    // Можно здесь оставить установку флага, если требуется
    setIsDragActive(true);
  };

  // Обработчик изменения файла
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFile(e.target.files);
    }
  };

  // Объединение локального класса и переданного
  const dropZoneClassName = `${classes['dropZone']} ${isDragActive ? classes['dropZone--active'] : ''} ${className || ''}`;

  return (
    <>
      <div
        className={dropZoneClassName}
        onClick={triggerFileInput}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          style={{display: 'none'}}
          ref={fileInput}
          type="file"
          accept="image/*"
          onChange={handleChange}
        />
        {preview ? (
          <img className={classes.previewImage} src={preview}></img>
        ) : (
          <div>
            <svg fill="#0875bc" height="70px" width="70px" version="1.1"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 487 487">
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
              <g><g><path d="M308.1,277.95c0,35.7-28.9,64.6-64.6,64.6s-64.6-28.9-64.6-64.6s28.9-64.6,64.6-64.6S308.1,242.25,308.1,277.95z M440.3,116.05c25.8,0,46.7,20.9,46.7,46.7v122.4v103.8c0,27.5-22.3,49.8-49.8,49.8H49.8c-27.5,0-49.8-22.3-49.8-49.8v-103.9 v-122.3l0,0c0-25.8,20.9-46.7,46.7-46.7h93.4l4.4-18.6c6.7-28.8,32.4-49.2,62-49.2h74.1c29.6,0,55.3,20.4,62,49.2l4.3,18.6H440.3z M97.4,183.45c0-12.9-10.5-23.4-23.4-23.4c-13,0-23.5,10.5-23.5,23.4s10.5,23.4,23.4,23.4C86.9,206.95,97.4,196.45,97.4,183.45z M358.7,277.95c0-63.6-51.6-115.2-115.2-115.2s-115.2,51.6-115.2,115.2s51.6,115.2,115.2,115.2S358.7,341.55,358.7,277.95z"></path></g></g></g>
            </svg>
            <p className={[classes.text, classes['text--upload']].join(' ')}>Перетащите, кликните<br/> или сделайте изображение</p>
          </div>
        )}
      </div>
      {error ? <p className={[classes.text, classes['text--error'], classes['error-margin']].join(' ')}>{error}</p> : null}
    </>
  );
};

export default FileUpload;