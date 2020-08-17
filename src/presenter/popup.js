import PopupFilmDetails from "../view/popup-details.js";
import {render, remove} from "../utils/render.js";

export default class PopupPresenter {
  constructor(filmsBoard) {
    this._filmsBoard = filmsBoard;
  }

  init(film) {
    this._film = film;

    this._renderPopup(film);
  }

  _renderPopup(film) {
    const filmPopupComponent = new PopupFilmDetails(film);

    const filmPopupElement = filmPopupComponent.getElement();

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        evt.preventDefault();
        deletePopup();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    const deletePopup = () => {
      filmPopupElement.remove();
      filmPopupComponent.removeElement();
      document.removeEventListener(`keydown`, onEscKeyDown);
    };

    const createPopup = () => {
      if (filmPopupElement) {
        deletePopup();
      }

      render(this._filmsBoard, filmPopupElement);

      document.addEventListener(`keydown`, onEscKeyDown);
    };

    filmPopupComponent.setCloseClickHandler(`.film-details__close-btn`, () => {
      deletePopup();
    });

    createPopup();
  }
}
