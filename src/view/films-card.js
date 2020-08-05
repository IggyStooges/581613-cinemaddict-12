export const createFilmsCard = (data, comments) => {
  const {descriptions, poster, title, rating, year, duration, isWatched, isFavorite, isWatchList} = data;
  const numberOfComments = comments.length;

  const favoriteClassName = isFavorite
  ? `film-card__controls-item--favorite film-card__controls-item--active`
  : `film-card__controls-item--favorite`;

  const watchedClassName = isWatched
  ? `film-card__controls-item--mark-as-watched film-card__controls-item--active`
  : `film-card__controls-item--mark-as-watched`;

  const watcListClassName = isWatchList
  ? `film-card__controls-item--add-to-watchlist film-card__controls-item--active`
  : `film-card__controls-item--add-to-watchlist`;

  const calculateRatingColor = () => {
    let colorCode = ``;
    if (rating < 5) {
      colorCode = `poor`;
    } else if (rating >= 5 && rating < 8){
      colorCode = `average`;
    } else {
      colorCode = `good`;
    }

    return colorCode;
  }

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating film-card__rating--${calculateRatingColor()}">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${year}</span>
        <span class="film-card__duration">${duration}</span>
        <span class="film-card__genre">Musical</span>
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${descriptions}</p>
      <a class="film-card__comments">${numberOfComments} comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button ${watcListClassName}">Add to watchlist</button>
        <button class="film-card__controls-item button ${watchedClassName}">Mark as watched</button>
        <button class="film-card__controls-item button ${favoriteClassName}">Mark as favorite</button>
      </form>
    </article>`
  );
};
