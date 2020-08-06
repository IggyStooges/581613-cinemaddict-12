export const generateFilters = (films) => {
  let watchedFilmsNumber = 0;
  let watchListsFilmsNumber = 0;
  let favoriteListsFilmsNumber = 0;

  for (let film of films) {
    const {isWatched, isFavorite, isWatchList} = film;

    if (isWatched) {
      watchedFilmsNumber++;
    }
    if (isWatchList) {
      watchListsFilmsNumber++;
    }
    if (isFavorite) {
      favoriteListsFilmsNumber++;
    }
  }

  return {
    watchedFilmsNumber,
    watchListsFilmsNumber,
    favoriteListsFilmsNumber,
  };
};
