import {getRandomInteger} from "../utils/utils.js";
import {generateRandomStringFromArray} from "../utils/utils.js";

const MIN_VIEWED_MOVIE = 0;
const MAX_VIEWED_MOVIE = 1000;

const avatarsPaths = [
  `./images/emoji/angry.png`,
  `./images/emoji/puke.png`,
  `./images/emoji/sleeping.png`,
  `./images/emoji/smile.png`,
  `./images/bitmap.png`,
];

export const generateProfile = () => {
  return {
    numbersOfFilms: getRandomInteger(MIN_VIEWED_MOVIE, MAX_VIEWED_MOVIE),
    avatar: generateRandomStringFromArray(avatarsPaths),
  };
};
