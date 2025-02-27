import React, { useState } from 'react';
import './App.scss';
import FileUpload from './components/FileUpload/FileUpload';
import ButtonCommon from './components/ButtonCommon/ButtonCommon';
import logo from './img/logo.png';
import PlateAnswer from './components/PlateAnswer/PlateAnswer';

const SERVER_URL = 'http://localhost:5000';

interface ResponseData {
  results: {
    plate: string,
    region: {
      code: string,
    }
  }[]
}

interface AnswerItem {
  plate: string;
  region: string;
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

  // Обработчик изменения файла
  const handleChangeFile = (file: File) => {
    // Обнуляем предыдущий ответ и ошибку
    setAnswer(null);
    setError('');

    setFile(file);
    // Кнопка становится разблокированной
    setDisabled(false);
  }

  const handleClick = async () => {
    // Установка кнопки активной и заблокированной во время запроса
    setActive(true);
    setDisabled(true);

    // Обнуляем предыдущий ответ и ошибку
    setAnswer(null);
    setError('');

    // Добавление файла изображения в форму
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${SERVER_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });
      const { results }: ResponseData = await res.json();
      const formattedResult = results.map(result => 
        ({ plate: result.plate, region: result.region.code })
      );
      formattedResult.length ? setAnswer(formattedResult) : setError('К сожалению не удалось определить номер. Попробуйте другую фотографию');
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
      </main>
    </div>
  );
};

export default App;