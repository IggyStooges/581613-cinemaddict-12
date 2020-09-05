import AbstractView from "./abstract.js";
import {SortType} from "../const.js";
import {isEvtTargetNoLinkElement} from "../utils/utils.js";

const createSortMenu = (currentSortType) => {
  return (
    `<ul class="sort">
      <li><a href="#"  class="sort__button ${currentSortType === SortType.DEFAULT ? `sort__button--active` : ``}" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
      <li><a href="#" class="sort__button ${currentSortType === SortType.DATE ? `sort__button--active` : ``}" data-sort-type="${SortType.DATE}">Sort by date</a></li>
      <li><a href="#" class="sort__button ${currentSortType === SortType.RATING ? `sort__button--active` : ``}" data-sort-type="${SortType.RATING}">Sort by rating</a></li>
    </ul>`
  );
};

export default class SortMenu extends AbstractView {
  constructor(currentSortType) {
    super();

    this._currentSortType = currentSortType;
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortMenu(this._currentSortType);
  }

  _sortTypeChangeHandler(evt) {
    isEvtTargetNoLinkElement(evt);

    evt.preventDefault();
    this._callback(evt.target.dataset.sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback = callback;
    this.getElement().addEventListener(`click`, this._sortTypeChangeHandler);
  }
}
