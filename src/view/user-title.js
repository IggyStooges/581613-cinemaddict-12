import {USER_TITLES} from "../const.js"

export const createUserTitle = (profileData) => {
  const {numbersOfFilms, avatar} = profileData;

  let userTitle;

  if (numbersOfFilms === 0) {
    userTitle = USER_TITLES[0];
  } else if(numbersOfFilms>=1 && numbersOfFilms<=10) {
    userTitle = USER_TITLES[1];
  } else if (numbersOfFilms>=11 && numbersOfFilms<=20) {
    userTitle = USER_TITLES[2];
  } else if (numbersOfFilms > 20) {
    userTitle = USER_TITLES[3];
  }

  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${userTitle}</p>
      <img class="profile__avatar" src="${avatar}" alt="Avatar" width="35" height="35">
      </section>`
  );
};
