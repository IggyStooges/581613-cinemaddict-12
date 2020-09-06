import AbstractView from "./abstract-view.js";

const createShowMoreButton = () => {
  return (
    `<button class="films-list__show-more">Show more</button>`
  );
};

export default class ShowMoreButton extends AbstractView {
  constructor() {
    super();

    this._clickHandler = this._clickHandler.bind(this);
  }
  getTemplate() {
    return createShowMoreButton();
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback();
  }

  setClickHandler(callback) {
    this._callback = callback;

    this.getElement().addEventListener(`click`, this._clickHandler);
  }
}
