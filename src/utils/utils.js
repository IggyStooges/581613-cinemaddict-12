import moment from "moment";
import {SuccessHTTPStatusRange} from "../const.js";
import {USER_TITLES} from "../const.js";

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const generateRandomStringFromArray = (array) => {
  const randomIndex = getRandomInteger(0, array.length - 1);
  return array[randomIndex];
};

export const generateSetByArray = (array) => {
  const newSet = new Set();

  for (let i = 0; i <= array.length; i++) {
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

export const parseFilmDuration = (dataDuration) => {
  const time = moment.utc().startOf(`day`).add({minutes: dataDuration});
  const hours = time.hour() ? `${time.hour()}h ` : ``;
  return `${hours}${time.minutes()}m`;
};

export const getReleaseDate = (date) => {
  return moment(date).format(`DD MMMM YYYY`);
};

export const getMoment = (commentDate) => {
  return moment(commentDate).fromNow();
};

export const cutDescription = (description) => {
  return description.length > 140 ? `${description.substring(0, 139)}...` : description;
};

export const isSuccessStatus = (status) => {
  return status >= SuccessHTTPStatusRange.MIN && status <= SuccessHTTPStatusRange.MAX;
};

export const convertUserTitle = (numbersOfFilms) => {
  if (numbersOfFilms === 0) {
    return USER_TITLES[0];
  } else if (numbersOfFilms >= 1 && numbersOfFilms <= 10) {
    return USER_TITLES[1];
  } else if (numbersOfFilms >= 11 && numbersOfFilms <= 20) {
    return USER_TITLES[2];
  } else if (numbersOfFilms > 20) {
    return USER_TITLES[3];
  }
  return ``;
};
