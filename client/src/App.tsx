import React, { useEffect, useState } from 'react';
import './App.scss';


const App = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Выполняем запрос к API-серверу
    fetch('http://localhost:5000/api/hello')
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(err => console.error('Ошибка при запросе к серверу:', err));
  }, []);

  return (
    <div className="container">
      <h1 className="title">Привет!</h1>
      <p>Сообщение с сервера: {message}</p>
    </div>
  );
};

export default App;