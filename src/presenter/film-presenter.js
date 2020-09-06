import {render, replace, remove} from "../utils/render.js";
import {UserAction, UpdateType, END_POINT, AUTHORIZATION} from "../const.js";
import PopupFilmDetails from "../view/popup-details.js";
import FilmsCard from "../view/films-card.js";
import Api from "../api/api.js";

const api = new Api(END_POINT, AUTHORIZATION);

export const blockedCardsIfPopupOpened = (cards, isBlocked) => {
    for (const card of cards) {
      const activatePopupElements = [card.querySelector(`.film-card__poster`), card.querySelector(`.film-card__title`), card.querySelector(`.film-card__comments`)]
      for (const element of activatePopupElements) {
        if (isBlocked) {
          element.style.pointerEvents = `none`;
        } else {
          element.style = ``;
        }
      }
    };
}

const Mode = {
  CARD: `CARD`,
  POPUP: `POPUP`
};

export const Error = {
  ADDING: `ADDING`,
  DELETING: `DELETING`
};

export default class FilmPresenter {
  constructor(filmsBoard, filmsContainer, changeData, restoreMode) {
    this._filmsBoard = filmsBoard.getElement();
    this._filmsContainer = filmsContainer;
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleEmojiClick = this._handleEmojiClick.bind(this);
    this._handleDeleteCommentClick = this._handleDeleteCommentClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);

    this._deletePopup = this._deletePopup.bind(this);
    this._escKeyDown = this._escKeyDown.bind(this);
    this._changeData = changeData;
    this._mode = Mode.CARD;
    this._restoreModes = restoreMode;
    this._filmComponent = null;
    this._filmPopupComponent = null;
  }

  init(film, containerElement) {
    const prevFilmComponent = this._filmComponent;
    this._prevPopupComponent = this._filmPopupComponent;
    this._film = film;

    if (this._restoreModes) {
      const index = this._restoreModes.findIndex((mode) => mode.id === this._film.id);

      if (this._restoreModes[index] && this._restoreModes[index].mode === Mode.POPUP) {
        this._renderPopup();
      }
    }

    this._filmComponent = new FilmsCard(this._film);

    if (this._filmPopupComponent) {
      this._filmPopupElement = this._filmPopupComponent.getElement();
    }

    this._renderFilm(film, containerElement);

    if (!this._prevPopupComponent && !prevFilmComponent) {
      this._renderFilm(film, containerElement);
      return;
    }

    replace(this._filmComponent, prevFilmComponent);

    remove(this._prevPopupComponent);
    remove(prevFilmComponent);
  }

  restoreCurrentMode() {
    return {
      id: this._film.id,
      mode: this._mode
    };
  }

  _handleEmojiClick(evt) {
    render(this._filmPopupElement.querySelector(`.film-details__add-emoji-label`), evt.target);
  }

  _handleFavoriteClick() {
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        Object.assign({}, this._film, {
          isFavorite: !this._film.isFavorite,
        })
    );
  }

  _handleDeleteCommentClick(commentId) {
    const index = this._film.commentsIds.findIndex((comment) => comment === commentId);

    this._changeData(
        UserAction.REMOVE_COMMENT,
        UpdateType.MINOR,
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
        UpdateType.MINOR,
        this._film,
        newComment
    );
  }

  _handleWatchedClick() {
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        Object.assign({}, this._film, {
          isWatched: !this._film.isWatched,
          watchingDate: !this._film.isWatched ? new Date() : null
        })
    );
  }

  _handleWatchlistClick() {
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
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

    render(this._filmsContainer, this._filmComponent);
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
    blockedCardsIfPopupOpened(this._filmsBoard.querySelectorAll(`.film-card`), false);
  }

  _renderPopup() {
    this._mode = Mode.POPUP;

    blockedCardsIfPopupOpened(this._filmsBoard.querySelectorAll(`.film-card`), true);

    api.getComments(this._film.id)
    .then((comments) => {
      const filmWithComments = Object.assign({}, this._film, {comments});
      this._filmPopupComponent = new PopupFilmDetails(filmWithComments);
    })
    .catch(() => {
      this._filmPopupComponent = new PopupFilmDetails(this._film);
    })
    .finally(() => {
      this._filmPopupComponent.setCloseClickHandler(this._deletePopup);
      this._filmPopupComponent.restoreHandlers();
      this._filmPopupComponent.setFavoriteClickHandler(this._handleFavoriteClick);
      this._filmPopupComponent.setWatchedClickHandler(this._handleWatchedClick);
      this._filmPopupComponent.setWatchlistClickHandler(this._handleWatchlistClick);
      this._filmPopupComponent.setDeleteCommentClickHandler(this._handleDeleteCommentClick);
      this._filmPopupComponent.setFormSubmitHandler(this._handleFormSubmit);
      render(document.querySelector(`body`), this._filmPopupComponent);
    });
    document.addEventListener(`keydown`, this._escKeyDown);
  }
}
