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
import {SortType, UpdateType, UserAction} from "../const.js";
import FilmPresenter from "./film.js";
import {filter} from "../utils/filter.js";
import LoadingView from "../view/loading.js";

const FILM_COUNT_PER_STEP = 5;
const EXTRA_SECTIONS_FILMS_COUNT = 2;

export default class MovieList {
  constructor(filmsBoard, filmsModel, filtersModel, api) {
    this._filtersModel = filtersModel;
    this._filmsModel = filmsModel;
    this._filmsBoard = filmsBoard;
    this._renderedFilmCount = FILM_COUNT_PER_STEP;
    this._extraSectionFilmCount = EXTRA_SECTIONS_FILMS_COUNT;
    this._isLoading = true;
    this._api = api;

    this._sortMenuComponent = null;
    this._loadMoreButton = null;

    this._filmsSection = new FilmsSection();
    this._topRatedFilmsExtraSection = new TopRatedFilmsExtraSection();
    this._mostCommentedFilmsExtraSection = new MostCommentedFilmsExtraSection();
    this._NoFilmsMessage = new NoFilmsMessage();
    this._loadingComponent = new LoadingView();

    this._currentSortType = SortType.DEFAULT;
    this._filmPresenterList = {};
    this._filmsList = {};

    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleModelChange = this._handleModelChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filtersModel.addObserver(this._handleModelEvent);

    this._filmsContainer = this._filmsSection.getElement().querySelector(`.films-list__container`);
  }

  init() {
    this._renderFilmsSection();
    this._renderFilmsBoard();
  }

  _getFilms() {
    const films = this._filmsModel.getFilms();
    const filterType = this._filtersModel.getFilter();
    const filteredFilms = filter[filterType](films);

    switch (this._currentSortType) {
      case SortType.RATING:
        return filteredFilms.slice().sort(sortFilmRating).reverse();
      case SortType.DATE:
        return filteredFilms.slice().sort(sortFilmDate).reverse();
      case SortType.DEFAULT:
        return filteredFilms.slice();
    }

    return filteredFilms;
  }

  _renderFilmsSection() {
    render(this._filmsBoard, this._filmsSection);
  }

  _renderNoFilmsMessage() {
    render(this._filmsSection, this._NoFilmsMessage);
  }

  _handleViewAction(actionType, updateType, updateFilm, updateCommentData) {
    switch (actionType) {
      case UserAction.REMOVE_COMMENT:
        this._api.deleteComment(updateCommentData).then(() => {
          this._filmsModel.deleteComment(updateType, updateFilm, updateCommentData);
        });
        break;
      case UserAction.ADD_COMMENT:
        this._api.addComment(updateFilm, updateCommentData).then((response) => {
          this._filmsModel.addComment(updateType, updateFilm, response.comments);
        });
        break;
      default:
        this._api.updateFilm(updateFilm).then((response) => {
          const updatedFilm = Object.assign({}, response, {
            comments: updateFilm.comments
          });
          this._filmsModel.updateFilm(updateType, updatedFilm);
        });
        break;
    }
  }

  _handleModelEvent(updateType, film) {
    switch (updateType) {
      case UpdateType.MINOR:
        this._clearFilmsBoard();
        this._renderFilmsBoard();
        break;
      case UpdateType.MAJOR:
        this._clearFilmsBoard({resetRenderedFilmCount: true, resetSortType: true});
        this._renderFilmsBoard();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderFilmsBoard();
        break;
      default:
        this._filmPresenterList[film.id].init(film);
        break;
    }
  }

  _renderLoading() {
    render(this._filmsBoard, this._loadingComponent);
  }

  _handleModelChange() {
    Object
      .values(this._filmPresenterList)
      .forEach((presenter) => presenter.resetView());
  }

  _renderFilm(film, container = this._filmsContainer) {
    const filmPresenter = new FilmPresenter(container, this._handleViewAction, this._handleModelChange);
    filmPresenter.init(film);
    this._filmPresenterList[film.id] = filmPresenter;
  }

  _renderFilms(films) {
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
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;

    this._clearFilmsBoard({resetRenderedFilmCount: true});
    this._renderFilmsBoard();
  }

  _renderSortMenu() {
    if (this._sortMenuComponent !== null) {
      this._sortMenuComponent = null;
    }

    this._sortMenuComponent = new SortMenu(this._currentSortType);
    this._sortMenuComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._filmsBoard, this._sortMenuComponent, RenderPosition.BEFOREBEGIN);
  }

  _renderLoadMoreButton() {
    if (this._loadMoreButtonComponent !== null) {
      this._loadMoreButtonComponent = null;
    }

    this._loadMoreButton = new ShowMoreButton();

    render(this._filmsSection, this._loadMoreButton);

    this._loadMoreButton.setClickHandler(this._handleLoadMoreButtonClick);
  }

  _renderExtraSections() {
    render(this._filmsBoard, this._topRatedFilmsExtraSection);
    render(this._filmsBoard, this._mostCommentedFilmsExtraSection);

    const extraSections = this._filmsBoard.querySelectorAll(`.films-list--extra`);
    const extraFilms = [...this._filmsModel.getFilms()];

    for (const section of extraSections) {
      const extraSectionFilmsContainer = section.querySelector(`.films-list__container`);

      for (let i = 0; i < this._extraSectionFilmCount; i++) {
        this._renderFilm(extraFilms[getRandomInteger(i, extraFilms.length - 1)], extraSectionFilmsContainer);
      }
    }
  }

  _clearFilmsBoard({resetRenderedFilmCount = false, resetSortType = false} = {}) {
    const filmCount = this._getFilms().length;

    Object
      .values(this._filmPresenterList)
      .forEach((presenter) => presenter.destroy());

    this._filmPresenterList = {};

    const removedComponents = [this._loadingComponent, this._sortMenuComponent, this._NoFilmsMessage, this._loadMoreButton, this._topRatedFilmsExtraSection, this._mostCommentedFilmsExtraSection];

    for (let component of removedComponents) {
      remove(component);
    }

    if (resetRenderedFilmCount) {
      this._renderedFilmCount = FILM_COUNT_PER_STEP;
    } else {
      this._renderedFilmCount = Math.min(filmCount, this._renderedFilmCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderFilmsBoard() {
    const films = this._getFilms();
    const filmsCount = films.length;

    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    if (!this._getFilms().length) {
      this._renderNoFilmsMessage();
      return;
    }

    this._renderSortMenu();
    this._renderExtraSections();

    this._renderFilms(films.slice(0, Math.min(filmsCount, FILM_COUNT_PER_STEP)));

    if (filmsCount > FILM_COUNT_PER_STEP) {
      this._renderLoadMoreButton();
    }
  }
}
