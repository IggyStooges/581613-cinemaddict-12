const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const generateRating =() => {
  return getRandomInteger(10, 100) / 10;
}

const generateTitle = () => {
  const filmsTitles = [
    `Jay and Silent Bob Strike Back`,
    `Любовь и голуби`,
    `Aliens`,
    `The Big Lebowski`,
    `Snatch`,
    `Trainspotting`
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
    `./images/posters/the-man-with-the-golden-arm.jpg`
  ];

  const randomIndex = getRandomInteger(0, posterPaths.length - 1);

  return posterPaths[randomIndex];
};

const generateDescriptions = () => {
  const MAX_DESCRIPTION_NUMBER = 5;
  const MIN_DESCRIPTION_NUMBER = 1;

  const generateRandomDesription = () => {
    const descriptionExamples = [
      `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
      `In rutrum ac purus sit amet tempus.`,
      `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
      `Fusce tristique felis at fermentum pharetra.`,
      `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`
    ];

    const randomIndex = getRandomInteger(0, descriptionExamples.length - 1);
    return descriptionExamples[randomIndex];
  }

  return new Array(getRandomInteger(MIN_DESCRIPTION_NUMBER, MAX_DESCRIPTION_NUMBER)).fill().map(generateRandomDesription);
};

export const generateFilmsData = () => {
  return {
    title: generateTitle(),
    poster: generatePoster(),
    descriptions: generateDescriptions(),
    rating: generateRating()
  };
}
