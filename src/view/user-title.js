import {USER_TITLES} from "../const.js";
import {createElement} from "../utils.js";

const convertUserTitle = (numbersOfFilms) => {
  if (numbersOfFilms === 0) {
    return USER_TITLES[0];
  } else if (numbersOfFilms >= 1 && numbersOfFilms <= 10) {
    return USER_TITLES[1];
  } else if (numbersOfFilms >= 11 && numbersOfFilms <= 20) {
    return USER_TITLES[2];
  } else if (numbersOfFilms > 20) {
    return USER_TITLES[3];
  }
  return ``;
};

const createUserTitle = (profile) => {
  const {numbersOfFilms, avatar} = profile;

  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${convertUserTitle(numbersOfFilms)}</p>
      <img class="profile__avatar" src="${avatar}" alt="Avatar" width="35" height="35">
      </section>`
  );
};


export default class UserTitle {
  constructor(profile) {
    this._profile = profile;

    this._element = null;
  }

  getTemplate() {
    return createUserTitle(this._profile);
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
