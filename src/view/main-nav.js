import AbstractView from "./abstract.js";

const createMainNav = (data, currentFilterType) => {
  const {watchlist, favorites, watched, all} = data;
  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        <a href="#all" data-nav="films" class="main-navigation__item ${!currentFilterType ? `main-navigation__item--active` : ``}" data-filter-type="${all.type}">All movies</a>
        <a href="#watchlist" data-nav="films" class="main-navigation__item ${currentFilterType === watchlist.type ? `main-navigation__item--active` : ``}" data-filter-type="${watchlist.type}">Watchlist <span class="main-navigation__item-count"">${watchlist.count}</span></a>
        <a href="#history" data-nav="films" class="main-navigation__item ${currentFilterType === watched.type ? `main-navigation__item--active` : ``}" data-filter-type="${watched.type}">History <span class="main-navigation__item-count">${watched.count}</span></a>
        <a href="#favorites" data-nav="films" class="main-navigation__item ${currentFilterType === favorites.type ? `main-navigation__item--active` : ``}" data-filter-type="${favorites.type}">Favorites <span class="main-navigation__item-count">${favorites.count}</span></a>
      </div>
      <a href="#stats" data-nav="statistics" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export default class MainNav extends AbstractView {
  constructor(data, currentFilterType) {
    super();

    this._data = data;
    this._currentFilter = currentFilterType;
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
    this._menuClickHandler = this._menuClickHandler.bind(this);
    this._currentMenuChooseMode = `films`;
  }

  getTemplate() {
    return createMainNav(this._data, this._currentFilter);
  }

  _filterTypeChangeHandler(evt) {
    if (evt.target.tagName !== `A`) {
      return;
    }

    evt.preventDefault();
    this._callback(evt.target.dataset.filterType);
  }

  setFiltersTypeChangeHandler(callback) {
    this._callback = callback;
    this.getElement().addEventListener(`click`, this._filterTypeChangeHandler);
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== `A`) {
      return;
    }

    if (this._currentMenuChooseMode !== evt.target.dataset.nav) {
      this._menuClickCallback(evt.target.dataset.nav);
      this._currentMenuChooseMode = evt.target.dataset.nav;
    }
  }

  setMenuClickHandler(callback) {
    this._menuClickCallback = callback;
    this.getElement().addEventListener(`click`, this._menuClickHandler);
  }

  setMenuItem(menuItem) {
    const item = this.getElement().querySelector(`[href=${menuItem}]`);

    if (item !== null) {
      item.classlist = `item.classlist.add`;
    }
  }
}
