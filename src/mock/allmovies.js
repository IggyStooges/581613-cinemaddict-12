import {getRandomInteger} from "../utils.js";
const MAX_MOVIES_NUMBER = 100;
const MIN_MOVIES_NUMBER = 20;

export const MOVIES_COUNT = getRandomInteger(MIN_MOVIES_NUMBER, MAX_MOVIES_NUMBER).toLocaleString();
