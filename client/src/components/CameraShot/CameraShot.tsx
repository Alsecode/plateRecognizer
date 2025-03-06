import React, { useEffect, useRef, useState } from 'react';

const CameraShot: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  useEffect(() => {
    let localStream: MediaStream | null = null;

    // Запуск камеры при монтировании компонента
    const startCamera = async () => {
      try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } } });
        if (videoRef.current) {
          videoRef.current.srcObject = localStream;
        }
      } catch (err) {
        console.error('Ошибка доступа к камере', err);
      }
    };

    startCamera();

    // Останавка потока камеры при размонтировании компонента
    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

    // Функция для захвата кадра с видео и создания изображения
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const width = videoRef.current.videoWidth;
      const height = videoRef.current.videoHeight;
      canvasRef.current.width = width;
      canvasRef.current.height = height;
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, width, height);
        const dataUrl = canvasRef.current.toDataURL('image/png');
        setCapturedImage(dataUrl);
      }
    }
  };

  // Функция для пересъёмки фото
  const retakePhoto = () => {
    setCapturedImage(null);
  };

  // Функция для отправки изображения на сервер
  const sendPhotoToServer = async () => {
    if (capturedImage) {
      try {
        const response = await fetch('/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: capturedImage }),
        });
        if (response.ok) {
          console.log('Фото успешно отправлено!');
        } else {
          console.error('Ошибка при отправке фото');
        }
      } catch (error) {
        console.error('Ошибка при отправке запроса', error);
      }
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
      {/* Видео всегда отображается */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ width: '100%', display: 'block' }}
      />

      {/* Если фото захвачено, накладываем его поверх видео */}
      {capturedImage && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        >
          <img
            src={capturedImage}
            alt="Снимок"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          <div style={{ position: 'absolute', bottom: 10, left: 10 }}>
            <button onClick={retakePhoto}>Переснять</button>
            <button onClick={sendPhotoToServer}>Отправить</button>
          </div>
        </div>
      )}

      {/* Кнопка для захвата фото, отображается только когда снимок отсутствует */}
      {!capturedImage && (
        <button onClick={capturePhoto} style={{ marginTop: '10px' }}>
          Сделать фото
        </button>
      )}

      {/* Скрытый canvas для захвата кадра */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );

}

export default CameraShot;