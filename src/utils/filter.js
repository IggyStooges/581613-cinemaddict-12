import {FiltersType} from "../const";

export const filter = {
  [FiltersType.ALL]: (films) => films.filter((film) => film),
  [FiltersType.FAVORITES]: (films) => films.filter((film) => film.isFavorite),
  [FiltersType.WATCHED]: (films) => films.filter((film) => film.isWatched),
  [FiltersType.WATCHLIST]: (films) => films.filter((film) => film.isWatchList)
};
