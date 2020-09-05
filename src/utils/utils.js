import moment from "moment";
import {SuccessHTTPStatusRange, UserTitles} from "../const.js";

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
    return UserTitles.NONE;
  } else if (numbersOfFilms >= 1 && numbersOfFilms <= 10) {
    return UserTitles.NOVICE;
  } else if (numbersOfFilms >= 11 && numbersOfFilms <= 20) {
    return UserTitles.FAN;
  } else if (numbersOfFilms > 20) {
    return UserTitles.MOVIE_BUFF;
  }
  return ``;
};
