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
import {generateFiltersData} from "./mock/filter.js";
import {generateProfileData} from "./mock/profile.js";
import {allMovieNUmber} from "./mock/allmovies.js";

const EXTRA_SECTIONS_FILMS_COUNT = 2;
const NUMBER_OF_GENERATED_CARD = 22;

const filmsCards = new Array(NUMBER_OF_GENERATED_CARD).fill().map(generateFilmsData);
const filtersData = generateFiltersData(filmsCards);
const profileData = generateProfileData();

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeader = document.querySelector(`.header`);
const siteMain = document.querySelector(`.main`);
const siteFooter = document.querySelector(`.footer`);

render(siteHeader, createUserTitle(profileData));
render(siteMain, createMainNav(filtersData), `afterbegin`);
render(siteMain, createSortMenu());
render(siteMain, createFilmsBoard());
render(siteFooter, createNumberOfFilms(allMovieNUmber));

const filmsBoard = siteMain.querySelector(`.films`);

render(filmsBoard, createFilmsSection());

const filmsSection = filmsBoard.querySelector(`.films-list`);
const filmsContainer = filmsSection.querySelector(`.films-list__container`);

const TASK_COUNT_PER_STEP = 5;

for (let i = 0; i < TASK_COUNT_PER_STEP; i++) {

  render(filmsContainer, createFilmsCard(filmsCards[i]));
}

render(filmsSection, createShowMoreButton());
const loadMoreButton = filmsSection.querySelector(`.films-list__show-more`);
let renderedFilmCount = TASK_COUNT_PER_STEP;

loadMoreButton.addEventListener(`click`, (e) => {

  e.preventDefault();
  filmsCards
    .slice(renderedFilmCount, renderedFilmCount + TASK_COUNT_PER_STEP)
    .forEach((card) => render(filmsContainer, createFilmsCard(card)));

  renderedFilmCount += TASK_COUNT_PER_STEP;

  if (renderedFilmCount >= filmsCards.length) {
    loadMoreButton.remove();
  }
});

render(filmsBoard, createTopRatedFilmsExtraSection());
render(filmsBoard, createMostCommentedFilmsExtraSection());

const extraSections = filmsBoard.querySelectorAll(`.films-list--extra`);

for (const section of extraSections) {
  const extraSectionFilmsContainer = section.querySelector(`.films-list__container`);

  for (let i = 0; i < EXTRA_SECTIONS_FILMS_COUNT; i++) {
    render(extraSectionFilmsContainer, createFilmsCard(filmsCards[i]));
  }
}
render(siteFooter, createPopupFilmDetails(filmsCards[0]), `afterend`);

