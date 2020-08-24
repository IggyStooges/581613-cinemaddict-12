import {getRandomInteger} from "../utils/utils.js";
import {render, remove} from "../utils/render.js";
import FilmsSection from "../view/films-section.js";
import ShowMoreButton from "../view/show-more-button.js";
import TopRatedFilmsExtraSection from "../view/top-rated-section.js";
import MostCommentedFilmsExtraSection from "../view/most-commented-section.js";
import NoFilmsMessage from "../view/no-film-message.js";
import SortMenu from "../view/sort-menu.js";
import {RenderPosition} from "../utils/render.js";
import {sortFilmDate, sortFilmRating} from "../utils/films.js";
import {SortType} from "../const.js";
import {updateItem} from "../utils/utils.js";
import FilmPresenter from "./film.js";

const FILM_COUNT_PER_STEP = 5;
const EXTRA_SECTIONS_FILMS_COUNT = 2;

export default class MovieList {
  constructor(filmsBoard, filmsModel) {
    this._filmsModel = filmsModel;
    this._filmsBoard = filmsBoard;
    this._renderedFilmCount = FILM_COUNT_PER_STEP;
    this._extraSectionFilmCount = EXTRA_SECTIONS_FILMS_COUNT;
    this._filmsSection = new FilmsSection();
    this._NoFilmsMessage = new NoFilmsMessage();
    this._loadMoreButton = new ShowMoreButton();
    this._sortMenuComponent = new SortMenu();
    this._currenSortType = SortType.DEFAULT;
    this._filmPresenterList = {};
    this._filmsList = {};

    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);

    this._filmsContainer = this._filmsSection.getElement().querySelector(`.films-list__container`);
  }

  init() {
    this._renderSortMenu();
    this._renderFilmsSection();
    this._renderFilmsBoard();
    this._renderExtraSections();
  }

  _getFilms() {
    switch (this._currentSortType) {
      case SortType.RATING:
        this._filmsCards.sort(sortFilmRating).reverse();
        break;
      case SortType.DATE:
        this._filmsCards.sort(sortFilmDate).reverse();
        break;
    }

    return this._filmsModel.getFilms();
  }

  _clearFilmsBoard() {
    this._filmsContainer.innerHTML = ``;
    this._renderedFilmCount = FILM_COUNT_PER_STEP;
  }

  _renderFilmsSection() {
    render(this._filmsBoard, this._filmsSection);
  }

  _renderNoFilmsMessage() {
    render(this._filmsSection, this._NoFilmsMessage);
  }

  _handleFilmChange(updatedFilm) {
    this._filmPresenterList[updatedFilm.id].init(updatedFilm);
  }

  _handleModeChange() {
    Object
      .values(this._filmPresenterList)
      .forEach((presenter) => presenter.resetView());
  }

  _renderFilm(film, container = this._filmsContainer) {
    const filmPresenter = new FilmPresenter(container, this._handleFilmChange, this._handleModeChange);
    // filmPresenter.init(film);
    // this._filmPresenterList[film.id] = filmPresenter;
  }

  _renderFilms(films) {
    console.log(films);
    films.forEach((film) => this._renderFilm(film));
  }

  _handleLoadMoreButtonClick() {
    const filmsCount = this._getFilms().length;
    const newRenderedFilmCount = Math.min(filmsCount, this._renderedFilmCount + FILM_COUNT_PER_STEP);
    const films = this._getFilms().slice(this._renderedFilmCount, newRenderedFilmCount);

    this._renderFilms(films);
    this._renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this._renderedFilmCount >= filmsCount) {
      remove(this._loadMoreButton);
    }
  }

  _handleSortTypeChange(sortType) {
    this._currentSortType = sortType;

    if (this._currenSortType === sortType) {
      return;
    }
    this._sortFilms(sortType);

    this._clearFilmsBoard();
    this._renderFilmsBoard();
  }

  _renderSortMenu() {
    render(this._filmsBoard, this._sortMenuComponent, RenderPosition.BEFOREBEGIN);

    this._sortMenuComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderLoadMoreButton() {
    render(this._filmsSection, this._loadMoreButton);

    this._loadMoreButton.setClickHandler(this._handleLoadMoreButtonClick);
  }

  _renderExtraSections() {
    render(this._filmsBoard, new TopRatedFilmsExtraSection());
    render(this._filmsBoard, new MostCommentedFilmsExtraSection());

    const extraSections = this._filmsBoard.querySelectorAll(`.films-list--extra`);

    for (const section of extraSections) {
      const extraSectionFilmsContainer = section.querySelector(`.films-list__container`);

      for (let i = 0; i < this._extraSectionFilmCount; i++) {
        this._renderFilm(this._getFilms().slice[getRandomInteger(i, this._getFilms().slice.length - 1)], extraSectionFilmsContainer);
      }
    }
  }

  _renderFilmsBoard() {
    console.log(this._getFilms())
    if (!this._getFilms().length) {
      this._renderNoFilmsMessage();
      return;
    }

    const filmsCount = this._getFilms().length;
    const films = this._getFilms().slice(0, Math.min(filmsCount, FILM_COUNT_PER_STEP));

    this._renderFilms(films);
    if (filmsCount > FILM_COUNT_PER_STEP) {
      this._renderLoadMoreButton();
    }

  }
}
