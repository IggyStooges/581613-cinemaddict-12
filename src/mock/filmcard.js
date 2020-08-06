import {getRandomInteger} from "../util.js";
import {generateCommentDatas} from "./comment.js";
import {generateManName} from "../util.js";
import {generateRandomStringFromArray} from "../util.js";
import {generateDate} from "../util.js";
import {generateSetByArray} from "../util.js";

const FIRST_FILM_YEAR = 1895;

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

const generateDescriptions = () => {
  const MAX_DESCRIPTION_NUMBER = 5;
  const MIN_DESCRIPTION_NUMBER = 1;

  const descriptionText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

  const desriptioтSentences = descriptionText.replace(/\.$/gm, ``).split(`. `);

  let descriptionSet = generateSetByArray(desriptioтSentences, MAX_DESCRIPTION_NUMBER, MIN_DESCRIPTION_NUMBER);

  const generatedDescription = Array.from(descriptionSet).join(`. `);

  return generatedDescription.length > 140
    ? `${generatedDescription.substring(0, 139)}...`
    : generatedDescription;
};

const generateDuration = () => {
  const MAX_FILM_DURATION_HOURS = 10;
  const MINUTES_IN_HOURS = 60;

  let generatedHour = getRandomInteger(0, MAX_FILM_DURATION_HOURS);
  let generatedMinute = getRandomInteger(0, MINUTES_IN_HOURS);

  let hour = generatedHour > 0 ? `${generatedHour}h` : ``;
  let minute = generatedMinute > 0 ? `${generatedMinute}m` : ``;

  return `${hour + minute}`;
};

const generateGenres = () => {
  const MAX_GENRES_NUMBER = 3;
  const MIN_GENRES_NUMBER = 1;

  const genresExamples = [`Drama`, `Comedy`, `Tragedy`, `Documental`];

  let genresSet = generateSetByArray(genresExamples, MAX_GENRES_NUMBER, MIN_GENRES_NUMBER);

  return Array.from(genresSet);
};

const generateFewNames = () => {
  const MAX_NAMES = 5;
  const MIN_NAMES = 1;

  const generateWritersArray = new Array(getRandomInteger(MIN_NAMES, MAX_NAMES)).fill().map(generateManName);

  let genresSet = generateSetByArray(generateWritersArray, MAX_NAMES, MIN_NAMES);

  return Array.from(genresSet).join(`, `);
};

export const generateFilmsData = () => {
  return {
    title: generateTitle(),
    originalTitle: generateTitle(),
    poster: generatePoster(),
    descriptions: generateDescriptions(),
    rating: generateRating(),
    year: getRandomInteger(FIRST_FILM_YEAR, new Date().getFullYear()),
    date: generateDate().toLocaleString(`en-JM`, {month: `long`, day: `numeric`}),
    duration: generateDuration(),
    isWatched: Boolean(getRandomInteger(0, 1)),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    isWatchList: Boolean(getRandomInteger(0, 1)),
    comments: generateCommentDatas(),
    age: getRandomInteger(4, 24),
    author: generateManName(),
    writers: generateFewNames(),
    actors: generateFewNames(),
    genres: generateGenres(),
    country: generateCountry()
  };
};
