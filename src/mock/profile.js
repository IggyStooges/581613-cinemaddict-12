import {getRandomInteger} from "../util.js";
import {generateRandomStringFromArray} from "../util.js";

const MIN_VIEWED_MOVIE = 0;
const MAX_VIEWED_MOVIE = 1000;

const avatarsPath = [
  `./images/emoji/angry.png`,
  `./images/emoji/puke.png`,
  `./images/emoji/sleeping.png`,
  `./images/emoji/smile.png`,
  `./images/bitmap.png`,
];

export const generateProfileData = () => {
  return {
    numbersOfFilms: getRandomInteger(MIN_VIEWED_MOVIE, MAX_VIEWED_MOVIE),
    avatar: generateRandomStringFromArray(avatarsPath),
  };
};
