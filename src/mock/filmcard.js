import {getRandomInteger} from "../util.js";

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

  const randomIndex = getRandomInteger(0, filmsTitles.length - 1);

  return filmsTitles[randomIndex];
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

  const randomIndex = getRandomInteger(0, posterPaths.length - 1);

  return posterPaths[randomIndex];
};

const generateDescriptions = () => {
  const MAX_DESCRIPTION_NUMBER = 5;
  const MIN_DESCRIPTION_NUMBER = 1;

  let descriptionSet = new Set();
  const descriptionText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

  const desriptioтSentences = descriptionText.replace(/\.$/gm, "").split(`. `);

  for (let i = MIN_DESCRIPTION_NUMBER; i <= MAX_DESCRIPTION_NUMBER; i++) {
    const randomIndex = getRandomInteger(0, desriptioтSentences.length - 1);
    descriptionSet.add(desriptioтSentences[randomIndex]);
  }
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

  return `${hour + minute}`
};

export const generateFilmsData = () => {
  return {
    title: generateTitle(),
    poster: generatePoster(),
    descriptions: generateDescriptions(),
    rating: generateRating(),
    year: getRandomInteger(FIRST_FILM_YEAR, new Date().getFullYear()),
    duration: generateDuration(),
    isWatched: Boolean(getRandomInteger(0, 1)),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    isWatchList: Boolean(getRandomInteger(0, 1)),
  };
};
