import AbstractView from "./abstract-view.js";

const createShowMoreButton = () => {
  return (
    `<button class="films-list__show-more">Show more</button>`
  );
};

export default class ShowMoreButton extends AbstractView {
  constructor() {
    super();

    this._clickForShowMoreFilmsHandler = this._clickForShowMoreFilmsHandler.bind(this);
  }
  getTemplate() {
    return createShowMoreButton();
  }

  _clickForShowMoreFilmsHandler(evt) {
    evt.preventDefault();
    this._callback();
  }

  setClickHandler(callback) {
    this._callback = callback;

    this.getElement().addEventListener(`click`, this._clickForShowMoreFilmsHandler);
  }
}
