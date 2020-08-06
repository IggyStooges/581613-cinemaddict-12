import {getRandomInteger} from "../util.js";
const MAX_MOVIES_NUMBER = 500000;

export const allMovieNUmber = getRandomInteger(0, MAX_MOVIES_NUMBER).toLocaleString();
