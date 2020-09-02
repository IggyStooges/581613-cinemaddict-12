import AbstractView from "./abstract.js";
import {convertUserTitle} from "../utils/utils.js"

const createUserTitle = (profile) => {
  const {numbersOfFilms, avatar} = profile;

  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${convertUserTitle(numbersOfFilms)}</p>
      <img class="profile__avatar" src="${avatar}" alt="Avatar" width="35" height="35">
      </section>`
  );
};
export default class UserTitle extends AbstractView {
  constructor(profile) {
    super();
    this._profile = profile;
  }

  getTemplate() {
    return createUserTitle(this._profile);
  }
}
