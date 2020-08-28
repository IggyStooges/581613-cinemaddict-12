import AbstractView from "./abstract.js";
import {parseFilmDuration, getReleaseDate} from "../utils/utils.js";

const determineFavoriteClassName = (flag) => {
  const favoriteClassName = flag
    ? `film-card__controls-item--favorite film-card__controls-item--active`
    : `film-card__controls-item--favorite`;
  return favoriteClassName;
};

const determineWatchedClassName = (flag) => {
  const watchedClassName = flag
    ? `film-card__controls-item--mark-as-watched film-card__controls-item--active`
    : `film-card__controls-item--mark-as-watched`;
  return watchedClassName;
};

const determineWatcListClassName = (flag) => {
  const watcListClassName = flag
    ? `film-card__controls-item--add-to-watchlist film-card__controls-item--active`
    : `film-card__controls-item--add-to-watchlist`;
  return watcListClassName;
};

const calculateRatingColor = (rating) => {
  if (rating < 5) {
    return `poor`;
  } else if (rating >= 5 && rating < 8) {
    return `average`;
  } else {
    return `good`;
  }
};

const createFilmsCard = (film) => {
  const {
    description,
    poster,
    title,
    rating,
    date,
    runtime,
    isWatched,
    isFavorite,
    isWatchList,
    comments,
    genre,
  } = film;

  return `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating film-card__rating--${calculateRatingColor(rating)}">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${getReleaseDate(date)}</span>
        <span class="film-card__duration">${parseFilmDuration(runtime)}</span>
        <span class="film-card__genre">${!genre.length ? `` : genre[0]}</span>
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${description.length > 140 ? `${description.substring(0, 139)}...` : description}</p>
      <a class="film-card__comments">${comments.length} comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button ${determineWatcListClassName(isWatchList)}">Add to watchlist</button>
        <button class="film-card__controls-item button ${determineWatchedClassName(isWatched)}">Mark as watched</button>
        <button class="film-card__controls-item button ${determineFavoriteClassName(isFavorite)}">Mark as favorite</button>
      </form>
    </article>`;
};

export default class FilmsCard extends AbstractView {
  constructor(film) {
    super();

    this._film = film;
    this._clickHandler = this._clickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);

  }

  getTemplate() {
    return createFilmsCard(this._film);
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._favoriteClick();
  }

  _watchlistClickHandler(evt) {
    evt.preventDefault();
    this._watchlistClick();
  }

  _watchedClickHandler(evt) {
    evt.preventDefault();
    this._watchedClick();
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback();
  }

  setClickHandler(elementQuery, callback) {
    this._callback = callback;

    this.getElement().querySelector(elementQuery).addEventListener(`click`, this._clickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._favoriteClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, this._favoriteClickHandler);
  }

  setWatchlistClickHandler(callback) {
    this._watchlistClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, this._watchlistClickHandler);
  }

  setWatchedClickHandler(callback) {
    this._watchedClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, this._watchedClickHandler);
  }

}
