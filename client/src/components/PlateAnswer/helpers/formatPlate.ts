const ruMap = {
  A: 'A',
  B: 'B',
  E: 'Е',
  K: 'К', 
  М: 'М',
  H: 'Н',
  O: 'О',
  P: 'Р',
  C: 'C',
  T: 'Т',
  Y: 'У',
  X: 'Х',
}

// Форматирование номера машины
const formatPlate = (plate: string, locale: string): string => {
  const uppercased = plate.toUpperCase();
  if (locale !== 'ru') {
    return uppercased;
  }

  const localized = uppercased
    .split('')
    .map(letter => ruMap[letter] ? ruMap[letter] : letter);
  return localized.join('');
}

export default formatPlate;