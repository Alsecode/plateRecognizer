import React, { useEffect, useState } from 'react';

interface ILocation {
  latitude: number;
  longitude: number;
}

interface LiveDistanceTrackerProps {
  startLocation: ILocation;
}

// Функция подсчета расстояния по двум точкам
const calculateDistance = (loc1: ILocation, loc2: ILocation) => {
  // радиус Земли в метрах
  const R = 6371000;
  const dLat = ((loc2.latitude - loc1.latitude) * Math.PI) / 180;
  const dLon = ((loc2.longitude - loc1.longitude) * Math.PI) / 180;

  const lat1 = (loc1.latitude * Math.PI) / 180;
  const lat2 = (loc2.latitude * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) *
      Math.sin(dLon / 2) *
      Math.cos(lat1) *
      Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const LiveDistanceTracker: React.FC<LiveDistanceTrackerProps> = ({
  startLocation,
}) => {
  // Текущая позиция
  const [currentLocation, setCurrentLocation] = useState<ILocation | null>(null);
  // Расстояние до стартовой позиции
  const [distance, setDistance] = useState<number>(0);

  useEffect(() => {
    // watchPosition будет вызываться при каждом изменении геолокации
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation: ILocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setCurrentLocation(newLocation);

        // Считаем расстояние
        const dist = calculateDistance(startLocation, newLocation);
        setDistance(dist);
      },
      (err) => {
        console.error('Ошибка при отслеживании локации:', err);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 10000,
      }
    );

    // Очистка наблюдателя при размонтировании компонента
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [startLocation]);

  return (
    <div style={{ marginTop: '20px' }}>
      {currentLocation ? (
        <div>
          <p>Текущая позиция: </p>
          <ul>
            <li>Широта: {currentLocation.latitude}</li>
            <li>Долгота: {currentLocation.longitude}</li>
          </ul>
          <p>Расстояние от зафиксированной точки: {distance.toFixed(2)} м</p>
        </div>
      ) : (
        <p>Загрузка текущей геопозиции…</p>
      )}
    </div>
  );
}

export default LiveDistanceTracker;