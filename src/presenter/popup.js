import PopupFilmDetails from "../view/popup-details.js";
import {render, remove} from "../utils/render.js";
import {usersActivitys} from "../const.js"

export default class PopupPresenter {
  constructor(filmsBoard, changeData) {
    this._filmsBoard = filmsBoard;
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._changeData = changeData;
  }

  init(film) {
    this._film = film;
    this._filmPopupComponent = new PopupFilmDetails(film);

    this._renderPopup(film);
  }

  _handleFavoriteClick() {
    this._changeData(
        Object.assign(
            {},
            this._film,
            {
              isFavorite: !this._film.isFavorite
            }
        )
    );
  }

  _renderPopup() {
    const filmPopupElement = this._filmPopupComponent.getElement();

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        evt.preventDefault();
        deletePopup();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    const deletePopup = () => {
      filmPopupElement.remove();
      this._filmPopupComponent.removeElement();
      document.removeEventListener(`keydown`, onEscKeyDown);
    };

    const createPopup = () => {
      if (filmPopupElement) {
        deletePopup();
      }

      render(this._filmsBoard, filmPopupElement);

      document.addEventListener(`keydown`, onEscKeyDown);
    };

    this._filmPopupComponent.setCloseClickHandler(`.film-details__close-btn`, () => {
      deletePopup();
    });

    this._filmPopupComponent.setActivitysClickHandler(usersActivitys[`FAVORITE`], ()=> {
      this._handleFavoriteClick();
      filmPopupElement.querySelector(`#favorite`).checked = !filmPopupElement.querySelector(`#favorite`).checked;
      }
    );

    createPopup();
  }
}
