import {render, replace, remove} from "../utils/render.js";
import {UserAction, UpdateType, END_POINT, AUTHORIZATION} from "../const.js";
import PopupFilmDetails from "../view/popup-details.js";
import FilmsCard from "../view/films-card.js";
import Api from "../api.js";
const api = new Api(END_POINT, AUTHORIZATION);

const Mode = {
  CARD: `CARD`,
  POPUP: `POPUP`
};

export const Error = {
  ADDING: `ADDING`,
  DELETING: `DELETING`
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
    const prevFilmComponent = this._filmComponent;
    const prevPopupComponent = this._filmPopupComponent;

    this._film = film;
    this._isAddAborted = false;

    this._filmComponent = new FilmsCard(this._film);
    if (this._filmPopupComponent) {
      this._filmPopupElement = this._filmPopupComponent.getElement();
    }
    this._renderFilm(film, containerElement);

    if (!prevPopupComponent && !prevFilmComponent) {
      this._renderFilm(film, containerElement);
      return;
    }

    replace(this._filmComponent, prevFilmComponent);

    if (this._mode === Mode.POPUP) {
      replace(this._filmPopupComponent, prevPopupComponent);
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
    const index = this._film.commentsIds.findIndex((comment) => comment === commentId);

    this._changeData(
        UserAction.REMOVE_COMMENT,
        UpdateType.PATCH,
        Object.assign({}, this._film, {
          comments: [...this._film.comments.slice(0, index),
            ...this._film.comments.slice(index + 1)]
        }),
        commentId
    );
  }

  setErrorHandler(error) {
    switch (error) {
      case Error.ADDING:
        this._filmPopupComponent.setFormErrorHandler();
        break;
      default:
        this._filmPopupComponent.setDeleteErrorHandler();
        break;
    }
  }


  _handleFormSubmit(emoji, commentText) {
    const newComment = {
      emotion: emoji,
      date: new Date(),
      comment: commentText,
    };

    this._changeData(
        UserAction.ADD_COMMENT,
        UpdateType.PATCH,
        this._film,
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
    this._changeMode();
    this._mode = Mode.POPUP;
    api.getComments(this._film.id)
    .then((comments) => {
      const filmWithComments = Object.assign({}, this._film, {comments});
      this._filmPopupComponent = new PopupFilmDetails(filmWithComments);
    })
    .catch(() => {
      this._filmPopupComponent = new PopupFilmDetails(this._film);
      this._isAddAborted = !this._isAddAborted;
    })
    .finally(() => {
      this._filmPopupComponent.setCloseClickHandler(`.film-details__close-btn`, this._deletePopup);
      this._filmPopupComponent.restoreHandlers();
      this._filmPopupComponent.setFavoriteClickHandler(this._handleFavoriteClick);
      this._filmPopupComponent.setWatchedClickHandler(this._handleWatchedClick);
      this._filmPopupComponent.setWatchlistClickHandler(this._handleWatchlistClick);
      this._filmPopupComponent.setDeleteCommentClickHandler(this._handleDeleteCommentClick);
      this._filmPopupComponent.setFormSubmitHandler(this._handleFormSubmit, this._isAddAborted);
      render(document.querySelector(`body`), this._filmPopupComponent);
    });
    document.addEventListener(`keydown`, this._escKeyDown);
  }
}
