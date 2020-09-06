import AbstractView from "./abstract-view.js";
import {MenuMode} from "../const.js";
import {isEvtTargetNoLinkElement} from "../utils/utils.js";

const isFilmsMenuMode = (mode) => {
  return mode === MenuMode.FILMS;
};

const createMainNav = (data, currentFilterType, currentMenuMode) => {
  const {watchlist, favorites, watched, all} = data;
  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        <a href="#all" data-nav="${MenuMode.FILMS}"
          class="main-navigation__item ${!currentFilterType && isFilmsMenuMode(currentMenuMode) ? `main-navigation__item--active` : ``}"
          data-filter-type="${all.type}">All movies
        </a>
        <a href="#watchlist" data-nav="${MenuMode.FILMS}"
          class="main-navigation__item ${currentFilterType === watchlist.type && isFilmsMenuMode(currentMenuMode) ? `main-navigation__item--active` : ``}"
          data-filter-type="${watchlist.type}">Watchlist
          <span class="main-navigation__item-count"">${watchlist.count}</span>
        </a>
        <a href="#history" data-nav="${MenuMode.FILMS}"
          class="main-navigation__item ${currentFilterType === watched.type && isFilmsMenuMode(currentMenuMode) ? `main-navigation__item--active` : ``}"
          data-filter-type="${watched.type}">History
          <span class="main-navigation__item-count">${watched.count}</span>
        </a>
        <a href="#favorites" data-nav="${MenuMode.FILMS}"
          class="main-navigation__item ${currentFilterType === favorites.type && isFilmsMenuMode(currentMenuMode) ? `main-navigation__item--active` : ``}"
          data-filter-type="${favorites.type}">Favorites
          <span class="main-navigation__item-count">${favorites.count}</span>
        </a>
      </div>
      <a href="#stats" data-nav="${MenuMode.STATISTICS}"
        class="main-navigation__additional ${currentMenuMode === MenuMode.STATISTICS ? `main-navigation__additional--active` : ``}">Stats
      </a>
    </nav>`
  );
};

export default class MainNav extends AbstractView {
  constructor(data, currentFilterType, currentMenuMode) {
    super();

    this._data = data;
    this._currentFilter = currentFilterType;
    this._currentMenuMode = currentMenuMode;
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createMainNav(this._data, this._currentFilter, this._currentMenuMode);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    isEvtTargetNoLinkElement(evt);

    this._callback(evt.target.dataset.filterType);
  }

  setFiltersTypeChangeHandler(callback) {
    this._callback = callback;
    this.getElement().addEventListener(`click`, this._filterTypeChangeHandler);
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    isEvtTargetNoLinkElement(evt);

    if (this._currentMenuMode !== evt.target.dataset.nav) {
      this._menuClickCallback(evt.target.dataset.nav);
    }
  }

  setMenuClickHandler(callback) {
    this._menuClickCallback = callback;
    this.getElement().addEventListener(`click`, this._menuClickHandler);
  }
}
