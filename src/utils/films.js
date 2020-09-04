export const sortFilmDate = (firstFilm, secondFilm) => {
  const firstFilmDate = new Date(firstFilm.date);
  const secondFilmDate = new Date(secondFilm.date);
  return firstFilmDate.getTime() - secondFilmDate.getTime();
};

export const sortFilmRating = (firstFilm, secondFilm) => {
  return firstFilm.rating - secondFilm.rating;
};

export const sortFilmComments = (firstFilm, secondFilm) => {
  return firstFilm.comments.length - secondFilm.comments.length;
};
