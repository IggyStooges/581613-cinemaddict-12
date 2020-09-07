import AbstractView from "./abstract-view.js";
import {parseFilmDuration, getReleaseDate, cutDescription} from "../utils/utils.js";

const determineFavoriteClassName = (flag) => {
  const favoriteClassName = flag
    ? `film-card__controls-item--active`
    : ``;
  return favoriteClassName;
};

const determineWatchedClassName = (flag) => {
  const watchedClassName = flag
    ? `film-card__controls-item--active`
    : ``;
  return watchedClassName;
};

const determineWatcListClassName = (flag) => {
  const watcListClassName = flag
    ? `film-card__controls-item--active`
    : ``;
  return watcListClassName;
};

const calculateRatingColor = (rating) => {
  if (rating < 5) {
    return `poor`;
  } else if (rating >= 5 && rating < 8) {
    return `average`;
  }

  return `good`;
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
      <p class="film-card__description">${cutDescription(description)}</p>
      <a class="film-card__comments">${comments.length} comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${determineWatcListClassName(isWatchList)}">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${determineWatchedClassName(isWatched)}">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite ${determineFavoriteClassName(isFavorite)}">Mark as favorite</button>
      </form>
    </article>`;
};

export default class FilmsCard extends AbstractView {
  constructor(film) {
    super();

    this._film = film;
    this._openPopupElementsClickHandler = this._openPopupElementsClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);

    this._cardElement = this.getElement();
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

  _openPopupElementsClickHandler(evt) {
    evt.preventDefault();
    this._callback();
  }

  _getElementsOpenedPopup(cardElement = this._cardElement) {
    return [
      cardElement.querySelector(`.film-card__comments`),
      cardElement.querySelector(`.film-card__title`),
      cardElement.querySelector(`.film-card__poster`)
    ];
  }

  setOpenPopupClickHandler(callback) {
    this._callback = callback;

    this._getElementsOpenedPopup().forEach((element) => {
      element.addEventListener(`click`, this._openPopupElementsClickHandler);
    });
  }

  setFavoriteClickHandler(callback) {
    this._favoriteClick = callback;
    this._cardElement.querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, this._favoriteClickHandler);
  }

  setWatchlistClickHandler(callback) {
    this._watchlistClick = callback;
    this._cardElement.querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, this._watchlistClickHandler);
  }

  setWatchedClickHandler(callback) {
    this._watchedClick = callback;
    this._cardElement.querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, this._watchedClickHandler);
  }
}
