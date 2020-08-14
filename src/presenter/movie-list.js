import {getRandomInteger} from "../utils/utils.js";
import {render} from "../utils/render.js";
import FilmsSection from "../view/films-section.js";
import FilmsCard from "../view/films-card.js";
import ShowMoreButton from "../view/show-more-button.js";
import TopRatedFilmsExtraSection from "../view/top-rated-section.js";
import MostCommentedFilmsExtraSection from "../view/most-commented-section.js";
import PopupFilmDetails from "../view/popup-details.js";
import NoFilmsMessage from "../view/no-film-message.js";

const FILM_COUNT_PER_STEP = 5;
const EXTRA_SECTIONS_FILMS_COUNT = 2;

export default class MovieList {
  constructor(filmsBoard) {
    this._filmsBoard = filmsBoard;
    this._renderedFilmCount = FILM_COUNT_PER_STEP;
    this._extraSectionFilmCount = EXTRA_SECTIONS_FILMS_COUNT;
    this._filmsSection = new FilmsSection();
    this._NoDataMessage = new NoFilmsMessage();

    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);

    this._filmsContainer = this._filmsSection.getElement().querySelector(`.films-list__container`);
  }

  init(filmsCards) {
    this._filmsCards = filmsCards;

    this._renderFilmsBoard();
    this._renderFilmsSection();
    this._renderLoadMoreButton();
    this._renderExtraSections();
  }

  _renderFilmsSection() {
    render(this._filmsBoard, this._filmsSection);
  }

  _renderNoDataMessage() {
    render(this._filmsSection, this._NoDataMessage);
  };

  _renderFilm(film, containerElement = this._filmsContainer) {
    const filmCardComponent = new FilmsCard(film);

    filmCardComponent.setClickHandler(`.film-card__comments`, () => {
      this._renderPopup(film)
    });
    filmCardComponent.setClickHandler(`.film-card__title`, () => {
      this._renderPopup(film)
    });
    filmCardComponent.setClickHandler(`.film-card__poster`, () => {
      this._renderPopup(film)
    });

    render(containerElement, filmCardComponent);
  };

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

  _renderFilms(from, to) {
    this._filmsCards.slice(from, to).forEach((film) => this._renderFilm(film));
  }

  _handleLoadMoreButtonClick() {
    this._renderFilms(this._renderedFilmCount, this._renderedFilmCount + FILM_COUNT_PER_STEP);
    this._renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this._renderedFilmCount >= this._filmsCards.length) {
      remove(this._loadMoreButtonComponent);
    }
  }

  _renderLoadMoreButton() {
    const loadMoreButton = new ShowMoreButton();

    render(this._filmsSection, loadMoreButton.getElement());

    loadMoreButton.setClickHandler(this._handleLoadMoreButtonClick);
  }

  _renderExtraSections() {
    render(this._filmsBoard, new TopRatedFilmsExtraSection());
    render(this._filmsBoard, new MostCommentedFilmsExtraSection());

    const extraSections = this._filmsBoard.querySelectorAll(`.films-list--extra`);

    for (const section of extraSections) {
      const extraSectionFilmsContainer = section.querySelector(`.films-list__container`);

      for (let i = 0; i < this._extraSectionFilmCount; i++) {
        this._renderFilm(this._filmsCards[getRandomInteger(i, this._filmsCards.length)], extraSectionFilmsContainer);
      }
    }
  }


  _renderFilmsBoard() {
    if (!this._filmsCards.length) {
      createNoDataMessage();
      return;
    }

    this._renderFilms(0, this._renderedFilmCount);
  }
}
