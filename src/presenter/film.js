import {render, replace, remove} from "../utils/render.js";
import {UserAction, UpdateType} from "../const.js";
import PopupFilmDetails from "../view/popup-details.js";
import FilmsCard from "../view/films-card.js";
import {generateId, generateManName} from "../utils/utils.js";

const Mode = {
  CARD: `CARD`,
  POPUP: `POPUP`
};
export default class FilmPresenter {
  constructor(filmsBoard, changeData, changeMode) {
    this._filmsBoard = filmsBoard;
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleEmojiClick = this._handleEmojiClick.bind(this);
    this._handleDeleteCommentClick = this._handleDeleteCommentClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);

    this._deletePopup = this._deletePopup.bind(this);
    this._escKeyDown = this._escKeyDown.bind(this);
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._filmComponent = null;
    this._filmPopupComponent = null;

    this._mode = Mode.CARD;
  }

  init(film, containerElement) {
    this._emoji = ``;

    const prevFilmComponent = this._filmComponent;
    const prevPopupComponent = this._filmPopupComponent;

    this._film = film;
    if (prevPopupComponent) {
      this._emoji = prevPopupComponent.restoreEmoji();
    }
    this._filmPopupComponent = new PopupFilmDetails(film, this._emoji);
    this._filmComponent = new FilmsCard(film);
    this._filmPopupElement = this._filmPopupComponent.getElement();

    this._renderFilm(film, containerElement);

    if (!prevPopupComponent && !prevFilmComponent) {
      this._renderFilm(film, containerElement);
      return;
    }

    replace(this._filmPopupComponent, prevPopupComponent);
    replace(this._filmComponent, prevFilmComponent);

    if (this._mode === Mode.POPUP) {
      this._renderPopup();
    }

    remove(prevPopupComponent);
    remove(prevFilmComponent);
  }

  resetView() {
    if (this._mode !== Mode.CARD) {
      this._deletePopup();
    }
  }

  _handleEmojiClick(evt) {
    render(this._filmPopupElement.querySelector(`.film-details__add-emoji-label`), evt.target);
  }

  _handleFavoriteClick() {
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.PATCH,
        Object.assign({}, this._film, {
          isFavorite: !this._film.isFavorite,
        })
    );
  }

  _handleDeleteCommentClick(commentId) {
    const index = this._film.comments.findIndex((comment) => comment.id === Number(commentId));

    this._changeData(
        UserAction.REMOVE_COMMENT,
        UpdateType.PATCH,
        Object.assign({}, this._film, {
          comments: [...this._film.comments.slice(0, index),
            ...this._film.comments.slice(index + 1)]
        }),
        index
    );
  }

  _handleFormSubmit(emoji, comment) {
    const newComment = {
      id: generateId(),
      emodji: emoji,
      date: new Date(),
      author: generateManName(),
      text: comment,
    };

    this._changeData(
        UserAction.REMOVE_COMMENT,
        UpdateType.PATCH,
        Object.assign({}, this._film, {
          comments: [...this._film.comments, newComment]
        }),
        newComment
    );
  }

  _handleWatchedClick() {
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.PATCH,
        Object.assign({}, this._film, {
          isWatched: !this._film.isWatched,
        })
    );
  }

  _handleWatchlistClick() {
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.PATCH,
        Object.assign({}, this._film, {
          isWatchList: !this._film.isWatchList,
        })
    );
  }

  _renderFilm() {
    [`.film-card__comments`, `.film-card__title`, `.film-card__poster`].forEach((query) => {
      this._filmComponent.setClickHandler(query, () => {
        this._renderPopup();
      });
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
  }

  destroy() {
    remove(this._filmComponent);
    remove(this._filmPopupComponent);
  }

  _deletePopup() {
    remove(this._filmPopupComponent);
    document.removeEventListener(`keydown`, this._escKeyDown);
    this._mode = Mode.CARD;
  }

  _renderPopup() {
    this._emoji = ``;
    this._changeMode();
    this._mode = Mode.POPUP;
    render(document.querySelector(`body`), this._filmPopupComponent);

    document.addEventListener(`keydown`, this._escKeyDown);

    this._filmPopupComponent.setCloseClickHandler(`.film-details__close-btn`, this._deletePopup);
    this._filmPopupComponent.restoreHandlers();
    this._filmPopupComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmPopupComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmPopupComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmPopupComponent.setDeleteCommentClickHandler(this._handleDeleteCommentClick);
    this._filmPopupComponent.setFormSubmitHandler(this._handleFormSubmit);

  }
}
