import {render, RenderPosition, remove, replace} from "../utils/render.js";
import MainNav from "../view/main-nav.js";
import {filter} from "../utils/filter.js";
import {FiltersType, UpdateType} from "../const.js";
import Statistics from "../view/statistics.js";
import {MenuMode} from "../const.js";

export default class MainNavPresenter {
  constructor(container, filtersModel, filmsModel, filmsBoard) {
    this._container = container;
    this._filtersModel = filtersModel;
    this._filmsModel = filmsModel;
    this._filters = this._filtersModel.getFilter();

    this._filtersComponent = null;
    this._currentFiltersType = null;

    this._filmsBoard = filmsBoard;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFiltersTypeChange = this._handleFiltersTypeChange.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filtersModel.addObserver(this._handleModelEvent);
    this._currentMenuMode = MenuMode.FILMS;
  }

  init() {
    this._currentFiltersType = this._filtersModel.getFilter();
    const filters = this._getFilters();
    const prevFiltersComponent = this._filtersComponent;

    this._filtersComponent = new MainNav(filters, this._currentFiltersType, this._currentMenuMode);

    this._filtersComponent.setFiltersTypeChangeHandler(this._handleFiltersTypeChange);
    this._setMenuChangeHandler();

    if (prevFiltersComponent === null) {
      render(this._container, this._filtersComponent, RenderPosition.BEFOREBEGIN);
      return;
    }

    replace(this._filtersComponent, prevFiltersComponent);
    remove(prevFiltersComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFiltersTypeChange(filtersType) {
    if (this._currentFilter === filtersType) {
      return;
    }

    this._filtersModel.setFilter(UpdateType.MAJOR, filtersType);
  }

  _setMenuChangeHandler() {
    this._filtersComponent.setMenuClickHandler((e) => {
      this._handleSiteMenuClick(e);
    });
    this._filtersComponent.setFiltersTypeChangeHandler(this._handleFiltersTypeChange);
  }

  _handleSiteMenuClick(menuItem) {
    switch (menuItem) {
      case MenuMode.STATISTICS:
        this._currentMenuMode = MenuMode.STATISTICS;
        this._statisticBoard = new Statistics(this._filmsModel.getFilms());
        this._statisticBoard.setPeriodClickHandler();
        render(document.querySelector(`main`), this._statisticBoard);
        this._filmsBoard.destroy();
        break;
      default:
        this._currentMenuMode = MenuMode.FILMS;
        if (this._statisticBoard) {
          remove(this._statisticBoard);
        }
        this._filmsBoard.init();
        break;
    }
    this._handleModelEvent();
  }

  getWatchedCount() {
    return this._getFilters().watched.count;
  }

  _getFilters() {
    const films = this._filmsModel.getFilms();

    return {
      all: {
        type: FiltersType.ALL,
        name: ``,
        count: filter[FiltersType.ALL](films).length
      },
      favorites: {
        type: FiltersType.FAVORITES,
        name: `Favorites`,
        count: filter[FiltersType.FAVORITES](films).length
      },
      watchlist: {
        type: FiltersType.WATCHLIST,
        name: `Watchlist`,
        count: filter[FiltersType.WATCHLIST](films).length
      },
      watched: {
        type: FiltersType.WATCHED,
        name: `Watched`,
        count: filter[FiltersType.WATCHED](films).length
      },
    };
  }

  destroy() {
    remove(this._filtersComponent);
  }
}
