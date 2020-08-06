export const generateFiltersData = (datas) => {
  let watchedFilmsNumber = 0;
  let watchListsFilmsNumber = 0;
  let favoriteListsFilmsNumber = 0;

  for (let data of datas) {
    const {isWatched, isFavorite, isWatchList} = data;

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
