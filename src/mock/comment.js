import {getRandomInteger} from "../utils/utils.js";
import {generateManName} from "../utils/utils.js";
import {generateDate} from "../utils/utils.js";
import {Emojies} from "../const.js";

const MAX_COMMENTS = 5;

const generateEmodji = () => {
  const emojiesNames = Object.values(Emojies);
  const randomIndex = getRandomInteger(0, emojiesNames.length - 1);

  return emojiesNames[randomIndex];
};

const generateText = () => {
  const comments = [`Booooooooooring`, `Interesting setting and a good cast`, `Almost two hours? Seriously?`, `Very very old. Meh`];

  const randomIndex = getRandomInteger(0, comments.length - 1);

  return comments[randomIndex];
};

const generateData = () => {
  return {
    emodji: generateEmodji(),
    date: generateDate().toLocaleString(`en-US`, {day: `numeric`, month: `long`, year: `numeric`}),
    author: generateManName(),
    text: generateText(),
  };
};

export const generateComments = () => {
  return new Array(getRandomInteger(0, MAX_COMMENTS)).fill().map(generateData);
};
