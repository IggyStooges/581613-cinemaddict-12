import AbstractView from "./abstract.js";

export const createNumberOfFilms = (number) => {
  return (
    `<section class="footer__statistics">
      <p>${number} movies inside</p>
    </section>`
  );
};


export default class NumberOfFilms extends AbstractView {
  constructor(number) {
    super();
    this._number = number;
  }

  getTemplate() {
    return createNumberOfFilms(this._number);
  }
}
