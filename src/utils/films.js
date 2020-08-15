export const sortFilmDate = (firstFilm, secondFilm) => {
  return firstFilm.date.getTime() - secondFilm.date.getTime();
};

export const sortFilmRating = (firstFilm, secondFilm) => {
  return firstFilm.rating - secondFilm.rating;
};

