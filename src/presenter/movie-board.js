import {render, remove, RenderPosition} from "../utils/render.js";
import FilmsSection from "../view/films-section.js";
import ShowMoreButton from "../view/show-more-button.js";
import TopRatedSection from "../view/top-rated-section.js";
import MostCommentedSection from "../view/most-commented-section.js";
import NoFilmsMessage from "../view/no-film-message.js";
import SortMenu from "../view/sort-menu.js";
import {sortFilmDate, sortFilmRating, sortFilmComments} from "../utils/films.js";
import {shuffleArray} from "../utils/utils.js";
import {SortType, UpdateType, UserAction} from "../const.js";
import FilmPresenter, {Error as FilmPresenterError} from "./film-presenter.js";
import {filter} from "../utils/filter.js";
import LoadingView from "../view/loading.js";

const FILM_COUNT_PER_STEP = 5;
const EXTRA_SECTIONS_FILMS_COUNT = 2;

const getAllIndicators = (films, indicator) => {
  return films.map((film) => film[indicator]);
};

const checkAllIndicatorNull = (films, indicator) => {
  const isAllIndicatorNull = getAllIndicators(films, indicator).every((element) => element === 0 || element.length === 0);
  if (isAllIndicatorNull) {
    return true;
  }

  return false;
};

const checkAllIndicatorsEqual = (films, indicator) => {
  return [...new Set(getAllIndicators(films, indicator))].length !== 1;
};

export default class MovieBoard {
  constructor(filmsBoard, filmsModel, filtersModel, apiWithProvider, api) {
    this._filtersModel = filtersModel;
    this._filmsModel = filmsModel;
    this._filmsBoard = filmsBoard;
    this._renderedFilmCount = FILM_COUNT_PER_STEP;
    this._extraSectionFilmCount = EXTRA_SECTIONS_FILMS_COUNT;
    this._isLoading = true;
    this._api = api;
    this._apiWithProvider = apiWithProvider;

    this._sortMenuComponent = null;
    this._loadMoreButton = null;

    this._filmsSection = new FilmsSection();
    this._topRatedFilmsExtraSection = new TopRatedSection();
    this._mostCommentedFilmsExtraSection = new MostCommentedSection();
    this._NoFilmsMessage = new NoFilmsMessage();
    this._loadingComponent = new LoadingView();

    this._currentSortType = SortType.DEFAULT;
    this._filmPresenterList = {};
    this._topRatedFilmPresenterList = {};
    this._mostCommentedFilmPresenterList = {};

    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
  }

  init() {
    this._renderFilmsSection();
    this._filmsContainer = this._filmsSection.getElement().querySelector(`.films-list__container`);
    this._renderFilmsBoard();

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filtersModel.addObserver(this._handleModelEvent);
  }

  destroy() {
    this._clearFilmsBoard({resetRenderedFilmCount: true, resetSortType: true});

    remove(this._sortMenuComponent);
    remove(this._filmsSection);

    this._filmsModel.removeObserver(this._handleModelEvent);
    this._filtersModel.removeObserver(this._handleModelEvent);
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

  _handleRemoveComment(updateType, updateFilm, updateCommentData) {
    this._api.deleteComment(updateCommentData).then(() => {
      this._filmsModel.deleteComment(updateType, updateFilm, updateCommentData);
    }).catch(() => {
      this._presenterLists.forEach((presenterList) => {
        presenterList[updateFilm.id].setErrorHandler(FilmPresenterError.DELETING);
      });
    });
  }

  _handleAddComment(updateType, updateFilm, updateCommentData) {
    this._api.addComment(updateFilm, updateCommentData).then((response) => {
      this._filmsModel.addComment(updateType, updateFilm, response.comments);
    }).catch(() => {
      this._presenterLists.forEach((presenterList) => {
        presenterList[updateFilm.id].setErrorHandler(FilmPresenterError.ADDING);
      });
    });
  }

  _handleUpdateFilm(updateType, updateFilm) {
    this._apiWithProvider.updateFilm(updateFilm).then((response) => {
      const updatedFilm = Object.assign({}, response, {
        comments: updateFilm.comments
      });
      this._filmsModel.updateFilm(updateType, updatedFilm);
    });
  }

  _handleViewAction(actionType, updateType, updateFilm, updateCommentData) {
    switch (actionType) {
      case UserAction.REMOVE_COMMENT:
        this._handleRemoveComment(updateType, updateFilm, updateCommentData);
        break;
      case UserAction.ADD_COMMENT:
        this._handleAddComment(updateType, updateFilm, updateCommentData);
        break;
      default:
        this._handleUpdateFilm(updateType, updateFilm);
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
        this._clearFilmsBoard({resetRenderedFilmCount: true, resetSortType: true, resetFilmPresentersModes: true});
        this._renderFilmsBoard();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderFilmsBoard();
        break;
      default:
        this._presenterLists.forEach((presenterList) => {
          presenterList[film.id].init(film);
        });
        break;
    }
  }

  _renderLoading() {
    render(this._filmsBoard, this._loadingComponent);
  }

  _initFilm(film, mode, presenterList, container) {
    const filmPresenter = new FilmPresenter(this._filmsBoard, container, this._handleViewAction, mode);
    filmPresenter.init(film);
    presenterList[film.id] = filmPresenter;
  }

  _renderFilm(film, mode) {
    this._initFilm(film, mode, this._filmPresenterList, this._filmsContainer);
  }

  _renderExtraFilm(film, presenterList, container, mode) {
    this._initFilm(film, mode, presenterList, container);
  }

  _renderFilms(films, modes) {
    films.forEach((film) => {
      if (modes) {
        this._renderFilm(film, modes);
      } else {
        this._renderFilm(film);
      }
    });
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

  _renderTopRatedFilms(films, modes) {
    render(this._filmsBoard, this._topRatedFilmsExtraSection);

    const extraSectionFilmsContainer = this._topRatedFilmsExtraSection.getElement().querySelector(`.films-list__container`);

    films.forEach((film) => {
      if (modes) {
        this._renderExtraFilm(film, this._topRatedFilmPresenterList, extraSectionFilmsContainer, modes);
      } else {
        this._renderExtraFilm(film, this._topRatedFilmPresenterList, extraSectionFilmsContainer);
      }
    });
  }

  _renderMostCommentedFilms(films, modes) {
    render(this._filmsBoard, this._mostCommentedFilmsExtraSection);

    const extraSectionFilmsContainer = this._mostCommentedFilmsExtraSection.getElement().querySelector(`.films-list__container`);

    films.forEach((film) => {
      if (modes) {
        this._renderExtraFilm(film, this._mostCommentedFilmPresenterList, extraSectionFilmsContainer, modes);
      } else {
        this._renderExtraFilm(film, this._mostCommentedFilmPresenterList, extraSectionFilmsContainer);
      }
    });
  }

  _clearFilmsBoard({resetRenderedFilmCount = false, resetSortType = false, resetFilmPresentersModes = false} = {}) {
    const filmCount = this._getFilms().length;
    Object
      .values(this._filmPresenterList)
      .forEach((presenter) => {
        this._currentFilmModes.push(presenter.restoreCurrentMode());
        presenter.destroy();
      });

    Object
      .values(this._mostCommentedFilmPresenterList)
      .forEach((presenter) => {
        this._currentMostCommentedFilmModes.push(presenter.restoreCurrentMode());
        presenter.destroy();
      });

    Object
      .values(this._topRatedFilmPresenterList)
      .forEach((presenter) => {
        this._currentTopRatedFilmModes.push(presenter.restoreCurrentMode());
        presenter.destroy();
      });

    this._allCurrentModes = [...this._currentFilmModes, ...this._currentTopRatedFilmModes, ...this._currentMostCommentedFilmModes];

    const removedComponents = [
      this._loadingComponent,
      this._sortMenuComponent,
      this._NoFilmsMessage,
      this._loadMoreButton,
      this._topRatedFilmsExtraSection,
      this._mostCommentedFilmsExtraSection
    ];

    for (const removedРЎomponent of removedComponents) {
      remove(removedРЎomponent);
    }

    if (resetRenderedFilmCount) {
      this._renderedFilmCount = FILM_COUNT_PER_STEP;
    } else {
      this._renderedFilmCount = Math.min(filmCount, this._renderedFilmCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }

    if (resetFilmPresentersModes) {
      this._currentFilmModes = [];
      this._currentTopRatedFilmModes = [];
      this._currentMostCommentedFilmModes = [];
    }
  }

  _renderFilmsBoard() {
    const films = this._getFilms();
    const filmsCount = films.length;

    const shuffledArray = shuffleArray(films.slice());
    const sortedRatingFilms = films.slice().sort(sortFilmRating).reverse();
    const sortedCommentsFilms = films.slice().sort(sortFilmComments).reverse();
    const topRatedFilms = checkAllIndicatorsEqual(films, `rating`) ? sortedRatingFilms.slice(0, 2) : shuffledArray.slice(0, 2);
    const mostCommentedFilms = checkAllIndicatorsEqual(films, `comments`) ? sortedCommentsFilms.slice(0, 2) : shuffledArray.slice(0, 2);

    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    if (!this._getFilms().length) {
      this._renderNoFilmsMessage();
      return;
    }


    this._renderSortMenu();

    this._renderFilms(films.slice(0, this._renderedFilmCount), this._currentFilmModes);

    if (!checkAllIndicatorNull(films, `rating`)) {
      this._renderTopRatedFilms(topRatedFilms, this._currentTopRatedFilmModes);
    }

    if (!checkAllIndicatorNull(films, `comments`)) {
      this._renderMostCommentedFilms(mostCommentedFilms, this._currentMostCommentedFilmModes);
    }

    this._presenterLists = [this._filmPresenterList, this._mostCommentedFilmPresenterList, this._topRatedFilmPresenterList];

    if (filmsCount > this._renderedFilmCount) {
      this._renderLoadMoreButton();
    }

    this._currentFilmModes = [];
    this._currentTopRatedFilmModes = [];
    this._currentMostCommentedFilmModes = [];
  }
}
