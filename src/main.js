import {createUserTitle} from "./view/user-title.js";
import {createMainNav} from "./view/main-nav.js";
import {createSortMenu} from "./view/sort-menu.js";
import {createFilmsBoard} from "./view/films-board.js";
import {createNumberOfFilms} from "./view/number-of-films.js";
import {createFilmsSection} from "./view/films-section.js";
import {createFilmsCard} from "./view/films-card.js";
import {createShowMoreButton} from "./view/show-more-button.js";
import {createTopRatedFilmsExtraSection} from "./view/top-rated-section.js";
import {createMostCommentedFilmsExtraSection} from "./view/most-commented-section.js";
import {createPopupFilmDetails} from "./view/popup-details.js";
import {generateFilmsData} from "./mock/filmcard.js";

const FILMS_COUNT = 5;
const EXTRA_SECTIONS_FILMS_COUNT = 2;
const NUMBER_OF_GENERATED_CARD = 20;

const filmsCards = new Array(NUMBER_OF_GENERATED_CARD).fill().map(generateFilmsData);

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeader = document.querySelector(`.header`);
const siteMain = document.querySelector(`.main`);
const siteFooter = document.querySelector(`.footer`);

render(siteHeader, createUserTitle());
render(siteMain, createMainNav(), `afterbegin`);
render(siteMain, createSortMenu());
render(siteMain, createFilmsBoard());
render(siteFooter, createNumberOfFilms());

const filmsBoard = siteMain.querySelector(`.films`);

render(filmsBoard, createFilmsSection());

const filmsSection = filmsBoard.querySelector(`.films-list`);
const filmsContainer = filmsSection.querySelector(`.films-list__container`);

for (let i = 0; i < filmsCards.length; i++) {
  render(filmsContainer, createFilmsCard(filmsCards[i]));
}

render(filmsSection, createShowMoreButton());

render(filmsBoard, createTopRatedFilmsExtraSection());
render(filmsBoard, createMostCommentedFilmsExtraSection());

const extraSections = filmsBoard.querySelectorAll(`.films-list--extra`);

for (const section of extraSections) {
  const extraSectionFilmsContainer = section.querySelector(`.films-list__container`);
  for (let i = 0; i < EXTRA_SECTIONS_FILMS_COUNT; i++) {
    render(extraSectionFilmsContainer, createFilmsCard(filmsCards[i]));
  }
}

render(siteFooter, createPopupFilmDetails(), `afterend`);
