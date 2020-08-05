const MAX_COMMENTS = 5;

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

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

const generateDate = () => {
  const today = new Date();

  return today.toString();
};

const generateAuthor = () => {
  const names = [`John`, `James`, `Deelan`, `Mathew`, `Steven`];
  const surnames = [`Gerrard`, `Alonso`, `Rooney`, `Scholes`];

  const randomName = names[getRandomInteger(0, names.length - 1)];
  const randomSurName = surnames[getRandomInteger(0, surnames.length - 1)];

  return `${randomName} ${randomSurName}`;
};

const generateComment = () => {
  const comments = [`Booooooooooring`, `Interesting setting and a good cast`, `Almost two hours? Seriously?`, `Very very old. Meh`];

  const randomIndex = getRandomInteger(0, comments.length - 1);

  return comments[randomIndex];
};

const generateCommentData = () => {
  return {
    emodji: generateEmodji(),
    date: generateDate(),
    author: generateAuthor(),
    comment: generateComment(),
  };
};


export const generateCommentDatas = () => {
  return new Array(getRandomInteger(0, MAX_COMMENTS)).fill().map(generateCommentData);
}
