export const sortFilmDate = (filmA, filmB) => {
  if (filmA.year === filmB.year) {
    if (filmA.date.getMonth() === filmB.date.getMonth()) {
      return filmA.date.getDate() - filmB.date.getDate();
    }
    return filmA.date.getMonth() - filmB.date.getMonth();
  }

  return filmA.year - filmB.year;
};

export const sortFilmRating = (filmA, filmB) => {
  return filmA.rating - filmB.rating;
};

