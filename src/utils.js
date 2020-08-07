export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const generateRandomStringFromArray = (array) => {
  const randomIndex = getRandomInteger(0, array.length - 1);
  return array[randomIndex];
};

export const generateSetByArray = (array, max, min) => {
  const newSet = new Set();

  for (let i = min; i <= max; i++) {
    newSet.add(generateRandomStringFromArray(array));
  }

  return newSet;
};

export const generateManName = () => {
  const names = [`John`, `James`, `Deelan`, `Mathew`, `Steven`];
  const surnames = [`Gerrard`, `Alonso`, `Rooney`, `Scholes`];

  const randomName = generateRandomStringFromArray(names);
  const randomSurName = generateRandomStringFromArray(surnames);

  return `${randomName} ${randomSurName}`;
};

export const generateDate = () => {
  const maxDaysGap = getRandomInteger(1, 365);
  const daysGap = getRandomInteger(-maxDaysGap, maxDaysGap);
  const currentDate = new Date();

  currentDate.setHours(23, 59, 59, 999);

  currentDate.setDate(currentDate.getDate() + daysGap);

  return new Date(currentDate);
};
