import {render, RenderPosition, remove, replace} from "../utils/render.js";
import MainNav from "../view/main-nav.js";
import {filter} from "../utils/filter.js";
import {FiltersType, UpdateType} from "../const.js";

export default class MainNavPresenter {
  constructor(container, filtersModel, filmsModel) {
    this._container = container;
    this._filtersModel = filtersModel;
    this._filmsModel = filmsModel;
    this._filters = this._filtersModel.getFilter();

    this._filtersComponent = null;
    this._currentFiltersType = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFiltersTypeChange = this._handleFiltersTypeChange.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filtersModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._currentFiltersType = this._filtersModel.getFilter();

    const filters = this._getFilters();
    const prevFiltersComponent = this._filtersComponent;

    this._filtersComponent = new MainNav(filters, this._currentFiltersType);

    this._filtersComponent.setFiltersTypeChangeHandler(this._handleFiltersTypeChange);

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
