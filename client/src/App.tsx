import React, { useState, useEffect } from 'react';
import './App.scss';
import FileUpload from './components/FileUpload/FileUpload';
import ButtonCommon from './components/ButtonCommon/ButtonCommon';
import logo from './img/logo.png';
import PlateAnswer from './components/PlateAnswer/PlateAnswer';
import LiveDistanceTracker from './components/LiveDistanceTracker/LiveDistanceTracker';

const SERVER_URL = 'https://81a76c27b675b25154206762d515561e.serveo.net';

interface ResponseData {
  plateRecognition: {
    results: {
      plate: string,
      region: {
        code: string,
      }
    }[]
  },
};

interface AnswerItem {
  plate: string;
  region: string;
}

interface ILocation {
  latitude: number;
  longitude: number;
}

const App = () => {
  // Выбранный файл
  const [file, setFile] = useState<File | null>(null);

  // Состояния кнопки
  const [isActive, setActive] = useState<boolean>(false);
  const [isDisabled, setDisabled] = useState<boolean>(true);

  // Ответ
  const [answer, setAnswer] = useState<AnswerItem[] | null>(null);

  // Текст возникшей ошибки
  const [error, setError] = useState<string>('');

  // Текущая геопозиция (при загрузке)
  const [userLocation, setUserLocation] = useState<ILocation | null>(null);

  // Стартовая геопозиция (когда фотография успешно распознана)
  const [startLocation, setStartLocation] = useState<ILocation | null>(null);

  // При первом рендере получаем геолокацию (без наблюдения)


  // Обработчик изменения файла
  const handleChangeFile = async (file: File) => {
    setAnswer(null);
    setError('');
    setFile(file);
    setDisabled(false);
  }

  // Обработчик определения номера
  const handleClick = async () => {
    // Установка кнопки активной и заблокированной во время запроса
    setActive(true);
    setDisabled(true);

    // Обнуление предыдущего ответа и ошибки
    setAnswer(null);
    setError('');

    // Обнуление геолокации
    setStartLocation(null);
    setUserLocation(null);

    // Добавление файла изображения в форму
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }

    try {
      const res = await fetch(`${SERVER_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      const result: ResponseData = await res.json();
      
      const formattedResult = result.plateRecognition.results.map(result => ({ 
          plate: result.plate,
          region: result.region.code
      }));

      if (formattedResult.length) {
        setAnswer(formattedResult);

        // Установка стартовой позиции
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const currentLocation = { latitude, longitude };

            setUserLocation(currentLocation);
            setStartLocation(currentLocation);
          },
          (error) => {
            // Не удалось получить начальную позицию
            console.error('Error getting user location:', error);
          }
        )
      } else {
        setError('К сожалению не удалось определить номер. Попробуйте другую фотографию');
      }
    } catch (error) {
      console.error(error);
      setError('Произошла ошибка при отправке файла');
    } finally {
      setActive(false);
      setDisabled(false);
    }
  };


  return (
    <div className="container">
      <main className="main-content">
        <img className="logo main-content__logo" src={logo} alt="logo"></img>
        <h1 className="title main-content__title">Определение номера автомобиля по фотографии</h1>
        <FileUpload className="fileUpload" onFileChange={handleChangeFile} />
        <div className="btn-container">
          <ButtonCommon isActive={isActive} disabled={isDisabled} onClick={handleClick}>Определить</ButtonCommon>
        </div>
        {answer ? (
          <div className="plate-answer">
            {answer.map(answerItem => (
              <PlateAnswer key={answerItem.plate} answer={answerItem} />
            ))}
          </div>
        ) : null}
        {error ? <p className="plate-error">{error}</p> : null}
        {!error && startLocation && (
          <LiveDistanceTracker startLocation={startLocation} />
        )}
      </main>
    </div>
  );
};

export default App;