import {getRandomInteger} from "../utils//utils.js";
import {generateComments} from "./comment.js";
import {generateManName} from "../utils/utils.js";
import {generateRandomStringFromArray} from "../utils//utils.js";
import {generateDate} from "../utils/utils.js";
import {generateSetByArray} from "../utils/utils.js";

const FIRST_FILM_YEAR = 1895;

const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

const generateYear = () => {
  return getRandomInteger(FIRST_FILM_YEAR, new Date().getFullYear());
};

const generateRating = () => {
  return getRandomInteger(10, 100) / 10;
};

const generateTitle = () => {
  const filmsTitles = [
    `Jay and Silent Bob Strike Back`,
    `Любовь и голуби`,
    `Aliens`,
    `The Big Lebowski`,
    `Snatch`,
    `Trainspotting`,
  ];

  return generateRandomStringFromArray(filmsTitles);
};

const generateCountry = () => {
  const filmsCountry = [
    `USA`,
    `Canada`,
    `USSR`,
    `UK`,
    `Mexico`,
    `France`,
  ];

  return generateRandomStringFromArray(filmsCountry);
};

const generatePoster = () => {
  const posterPaths = [
    `./images/posters/the-dance-of-life.jpg`,
    `./images/posters/made-for-each-other.png`,
    `./images/posters/popeye-meets-sinbad.png`,
    `./images/posters/sagebrush-trail.jpg`,
    `./images/posters/santa-claus-conquers-the-martians.jpg`,
    `./images/posters/the-great-flamarion.jpg`,
    `./images/posters/the-man-with-the-golden-arm.jpg`,
  ];

  return generateRandomStringFromArray(posterPaths);
};

const generateFullDate = () => {
  const date = generateDate();
  date.setYear(generateYear());

  return date;
};

const generateDescriptions = () => {
  const MAX_DESCRIPTION_NUMBER = 5;
  const MIN_DESCRIPTION_NUMBER = 1;

  const descriptionText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

  const desriptioтSentences = descriptionText.replace(/\.$/gm, ``).split(`. `);

  const descriptionSet = generateSetByArray(desriptioтSentences, MAX_DESCRIPTION_NUMBER, MIN_DESCRIPTION_NUMBER);

  const generatedDescription = Array.from(descriptionSet).join(`. `);

  return generatedDescription.length > 140
    ? `${generatedDescription.substring(0, 139)}...`
    : generatedDescription;
};

const generateDuration = () => {
  const MAX_FILM_DURATION_HOURS = 10;
  const MINUTES_IN_HOURS = 60;

  const generatedHour = getRandomInteger(0, MAX_FILM_DURATION_HOURS);
  const generatedMinute = getRandomInteger(0, MINUTES_IN_HOURS);

  const hour = generatedHour > 0 ? `${generatedHour}h` : ``;
  const minute = generatedMinute > 0 ? `${generatedMinute}m` : ``;

  return `${hour + minute}`;
};

const generateGenres = () => {
  const MAX_GENRES_NUMBER = 3;
  const MIN_GENRES_NUMBER = 1;

  const genresExamples = [`Drama`, `Comedy`, `Tragedy`, `Documental`];

  const genresSet = generateSetByArray(genresExamples, MAX_GENRES_NUMBER, MIN_GENRES_NUMBER);

  return Array.from(genresSet);
};

const generateFewNames = () => {
  const MAX_NAMES = 5;
  const MIN_NAMES = 1;

  const generateWritersArray = new Array(getRandomInteger(MIN_NAMES, MAX_NAMES)).fill().map(generateManName);

  const genresSet = generateSetByArray(generateWritersArray, MAX_NAMES, MIN_NAMES);

  return Array.from(genresSet).join(`, `);
};

export const generateFilm = () => {
  return {
    id: generateId(),
    title: generateTitle(),
    originalTitle: generateTitle(),
    poster: generatePoster(),
    descriptions: generateDescriptions(),
    rating: generateRating(),
    date: generateFullDate(),
    duration: generateDuration(),
    isWatched: Boolean(getRandomInteger(0, 1)),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    isWatchList: Boolean(getRandomInteger(0, 1)),
    comments: generateComments(),
    age: getRandomInteger(4, 24),
    author: generateManName(),
    writers: generateFewNames(),
    actors: generateFewNames(),
    genres: generateGenres(),
    country: generateCountry()
  };
};
