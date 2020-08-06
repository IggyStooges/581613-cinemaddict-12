import {getRandomInteger} from "../util.js";
import {generateManName} from "../util.js";
import {generateDate} from "../util.js";

const MAX_COMMENTS = 5;

const generateEmodji = () => {
  const emodjiPaths = [
    `./images/emoji/angry.png`,
    `./images/emoji/puke.png`,
    `./images/emoji/sleeping.png`,
    `./images/emoji/smile.png`,
  ];

  const randomIndex = getRandomInteger(0, emodjiPaths.length - 1);

  return emodjiPaths[randomIndex];
};

const generateCommentText = () => {
  const comments = [`Booooooooooring`, `Interesting setting and a good cast`, `Almost two hours? Seriously?`, `Very very old. Meh`];

  const randomIndex = getRandomInteger(0, comments.length - 1);

  return comments[randomIndex];
};

const generateCommentData = () => {
  return {
    emodji: generateEmodji(),
    date: generateDate().toLocaleString(`en-US`, {day: `numeric`, month: `long`, year: `numeric`}),
    author: generateManName(),
    text: generateCommentText(),
  };
};


export const generateCommentDatas = () => {
  return new Array(getRandomInteger(0, MAX_COMMENTS)).fill().map(generateCommentData);
};
