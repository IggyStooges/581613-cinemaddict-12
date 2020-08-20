import PopupFilmDetails from "../view/popup-details.js";
import FilmsCard from "../view/films-card.js";

import { render, replace, remove } from "../utils/render.js";

const Mode = {
  CARDHANDLER: `CARD`,
  POPUPHANDLER: `POPUP`
};

export default class FilmPresenter {
  constructor(filmsBoard, changeData) {
    this._filmsBoard = filmsBoard;
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);

    this._deletePopup = this._deletePopup.bind(this);
    this._escKeyDown = this._escKeyDown.bind(this);
    this._changeData = changeData;
    this._filmComponent = null;
    this._filmPopupComponent = null;
    this._mode = Mode.CARDHANDLER;
  }

  init(film, containerElement) {
    const prevFilmcomponent = this._filmComponent;
    const prevPopupcomponent = this._filmPopupComponent;

    this._film = film;
    this._filmPopupComponent = new PopupFilmDetails(film);
    this._filmComponent = new FilmsCard(film);
    this._filmPopupElement = this._filmPopupComponent.getElement();

    this._renderFilm(film, containerElement);

    if (prevPopupcomponent === null && prevFilmcomponent === null) {
      this._renderFilm(film, containerElement);

      return
    }

    if (this._mode === Mode.CARDHANDLER) {
      replace(this._filmPopupComponent, prevPopupcomponent);
      replace(this._filmComponent, prevFilmcomponent);
    }

    if (this._mode === Mode.POPUPHANDLER) {
      this._deletePopup();
      replace(this._filmPopupComponent, prevPopupcomponent);
      replace(this._filmComponent, prevFilmcomponent);
      this._renderPopup();
    }
  }

  _handleFavoriteClick() {
    this._changeData(
      Object.assign({}, this._film, {
        isFavorite: !this._film.isFavorite,
      })
    );
  }

  _handleWatchedClick() {
    this._changeData(
      Object.assign({}, this._film, {
        isWatched: !this._film.isWatched,
      })
    );
  }

  _handleWatchlistClick() {
    this._changeData(
      Object.assign({}, this._film, {
        isWatchList: !this._film.isWatchList,
      })
    );
  }

  _renderFilm() {
    this._filmComponent.setClickHandler(`.film-card__comments`, () => {
      this._renderPopup();
    });
    this._filmComponent.setClickHandler(`.film-card__title`, () => {
      this._renderPopup();
    });
    this._filmComponent.setClickHandler(`.film-card__poster`, () => {
      this._renderPopup();
    });
    this._filmComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmComponent.setWatchedClickHandler(this._handleWatchedClick);

    render(this._filmsBoard, this._filmComponent);
  }

  _escKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._deletePopup();
      document.removeEventListener(`keydown`, this._escKeyDown);
    }
  };

  _deletePopup () {
    remove(this._filmPopupComponent);
    document.removeEventListener(`keydown`, this._escKeyDown);
    this._mode = Mode.CARDHANDLER;
  };

  _renderPopup() {
    this._mode = Mode.POPUPHANDLER;
      render(document.querySelector("body"), this._filmPopupComponent);

      document.addEventListener(`keydown`, this._escKeyDown);

    this._filmPopupComponent.setCloseClickHandler(`.film-details__close-btn`, this._deletePopup);

    this._filmPopupComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmPopupComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmPopupComponent.setWatchlistClickHandler(this._handleWatchlistClick);
  }
}
