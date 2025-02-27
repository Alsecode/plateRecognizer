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
            <svg height="70px" width="70px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="#0875bc">
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
              <g id="SVGRepo_iconCarrier"><g><path d="M389.736,62.933c-15.553,0-30.368,3.09-43.963,8.554C325.476,29.238,282.406,0,232.396,0 c-67.169,0-121.883,52.649-125.513,118.908c-3.982-0.533-8.014-0.91-12.152-0.91c-49.961,0-90.466,40.497-90.466,90.466 c0,49.968,40.505,90.465,90.466,90.465h144.458v113.197c5.367-1.507,10.989-2.343,16.782-2.343c5.784,0,11.406,0.836,16.782,2.343 V298.93h116.982c65.161,0,117.999-52.829,117.999-117.998C507.735,115.762,454.897,62.933,389.736,62.933z M389.736,265.366H94.731 c-31.376,0-56.902-25.526-56.902-56.901c0-31.376,25.526-56.902,56.902-56.902c2.122,0,4.564,0.197,7.694,0.615l35.981,4.81 l1.991-36.243c2.672-48.888,43.086-87.18,91.998-87.18c35.72,0,67.579,20.101,83.124,52.461l13.61,28.327l29.164-11.726 c10.12-4.065,20.69-6.13,31.442-6.13c46.544,0,84.435,37.874,84.435,84.435C474.171,227.492,436.28,265.366,389.736,265.366z"></path>
              <path d="M255.996,431.589c-22.207,0-40.21,17.994-40.21,40.202c0,22.207,18.003,40.21,40.21,40.21 c22.198,0,40.21-18.003,40.21-40.21C296.206,449.583,278.194,431.589,255.996,431.589z"></path> <path d="M89.576,455.008v33.564h106.732c-1.516-5.367-2.351-10.989-2.351-16.782c0-5.793,0.836-11.415,2.351-16.782 H89.576z"></path>
              <path d="M318.06,471.79c0,5.793-0.844,11.415-2.352,16.782h106.74v-33.564h-106.74 C317.216,460.375,318.06,465.997,318.06,471.79z"></path>
              <polygon points="201.487,180.104 231.224,180.104 231.224,234.613 280.775,234.613 280.775,180.104 310.513,180.104 255.987,113.196 "></polygon></g></g>
            </svg>
            <p className={[classes.text, classes['text--upload']].join(' ')}>Перетащите изображение сюда<br/> или кликните для выбора</p>
          </div>
        )}
      </div>
      {error ? <p className={[classes.text, classes['text--error'], classes['error-margin']].join(' ')}>{error}</p> : null}
    </>
  );
};

export default FileUpload;