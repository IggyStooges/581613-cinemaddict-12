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
  constructor(filmsBoard) {
    this._filmsBoard = filmsBoard;
    this._renderedFilmCount = FILM_COUNT_PER_STEP;
    this._extraSectionFilmCount = EXTRA_SECTIONS_FILMS_COUNT;
    this._filmsSection = new FilmsSection();
    this._NoFilmsMessage = new NoFilmsMessage();
    this._loadMoreButton = new ShowMoreButton();
    this._sortMenuComponent = new SortMenu();
    this._currenSortType = SortType.DEFAULT;
    this._filmPresenter = {};
    this._filmsList = {};

    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleFilmChange = this._handleFilmChange.bind(this);

    this._filmsContainer = this._filmsSection.getElement().querySelector(`.films-list__container`);
  }

  init(filmsCards) {
    this._filmsCards = filmsCards.slice();

    this._sourcedFilmsCards = filmsCards.slice();

    this._renderSortMenu();
    this._renderFilmsSection();
    this._renderFilmsBoard();
    this._renderLoadMoreButton();
    this._renderExtraSections();
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
    this._filmsCards = updateItem(this._filmsCards, updatedFilm);
    this._sourcedFilmsCards = updateItem(this._sourcedFilmsCards, updatedFilm);
    this._filmPresenter[updatedFilm.id].init(updatedFilm);
  }

  _renderFilm(film, container = this._filmsContainer) {
    const filmPresenter = new FilmPresenter(container, this._handleFilmChange);
    filmPresenter.init(film);
    this._filmPresenter[film.id] = filmPresenter;
  }

  _renderFilms(from, to) {
    this._filmsCards.slice(from, to).forEach((film) => this._renderFilm(film));
  }

  _handleLoadMoreButtonClick() {
    this._renderFilms(this._renderedFilmCount, this._renderedFilmCount + FILM_COUNT_PER_STEP);
    this._renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this._renderedFilmCount >= this._filmsCards.length) {
      remove(this._loadMoreButton);
    }
  }

  _sortFilms(sortType) {
    switch (sortType) {
      case SortType.RATING:
        this._filmsCards.sort(sortFilmRating).reverse();
        break;
      case SortType.DATE:
        this._filmsCards.sort(sortFilmDate).reverse();
        break;
      default:
        this._filmsCards = this._sourcedFilmsCards.slice();
    }

    this._currenSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
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
        this._renderFilm(this._filmsCards[getRandomInteger(i, this._filmsCards.length - 1)], extraSectionFilmsContainer);
      }
    }
  }

  _renderFilmsBoard() {
    if (!this._filmsCards.length) {
      this._renderNoFilmsMessage();
      return;
    }

    this._renderFilms(0, this._renderedFilmCount);
  }
}
