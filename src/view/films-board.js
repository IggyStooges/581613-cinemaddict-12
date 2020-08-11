import {createElement} from "../utils.js";

const createFilmsBoard = () => {
  return (
    `<section class="films">
    </section>`
  );
};

export default class FilmsBoard {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createFilmsBoard();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
