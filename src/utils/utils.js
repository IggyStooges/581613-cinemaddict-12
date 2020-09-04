import moment from "moment";
import {SuccessHTTPStatusRange} from "../const.js";
import {USER_TITLES} from "../const.js";

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
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
    return USER_TITLES.NONE;
  } else if (numbersOfFilms >= 1 && numbersOfFilms <= 10) {
    return USER_TITLES.NOVICE;
  } else if (numbersOfFilms >= 11 && numbersOfFilms <= 20) {
    return USER_TITLES.FAN;
  } else if (numbersOfFilms > 20) {
    return USER_TITLES.MOVIE_BUFF;
  }
  return ``;
};
