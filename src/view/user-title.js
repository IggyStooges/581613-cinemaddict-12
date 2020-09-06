import AbstractView from "./abstract-view.js";
import {convertUserTitle} from "../utils/utils.js";

const createUserTitle = (numbersOfFilms) => {
  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${convertUserTitle(numbersOfFilms)}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      </section>`
  );
};
export default class UserTitle extends AbstractView {
  constructor(numbersOfFilms) {
    super();
    this._numbersOfFilms = numbersOfFilms;
  }

  getTemplate() {
    return createUserTitle(this._numbersOfFilms);
  }

  updateElement(newNumberOfFilms) {
    this._numbersOfFilms = newNumberOfFilms;

    let prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);
    prevElement = null;
  }
}
