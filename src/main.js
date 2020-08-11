import UserTitle from "./view/user-title.js";
import MainNav from "./view/main-nav.js";
import SortMenu from "./view/sort-menu.js";
import FilmsBoard from "./view/films-board.js";
import NumberOfFilms from "./view/number-of-films.js";
import FilmsSection from "./view/films-section.js";
import FilmsCard from "./view/films-card.js";
import ShowMoreButton from "./view/show-more-button.js";
import TopRatedFilmsExtraSection from "./view/top-rated-section.js";
import MostCommentedFilmsExtraSection from "./view/most-commented-section.js";
import PopupFilmDetails from "./view/popup-details.js";
import NoFilmsMessage from "./view/no-film-message.js";
import { generateFilm } from "./mock/film.js";
import { generateFilters } from "./mock/filter.js";
import { generateProfile } from "./mock/profile.js";
import { render } from "./utils.js";
import { MOVIES_COUNT } from "./mock/allmovies.js";
import { RenderPosition } from "./utils.js";
import { getRandomInteger } from "./utils.js";

const EXTRA_SECTIONS_FILMS_COUNT = 2;
const NUMBER_OF_GENERATED_CARD = 22;

const filmsCards = new Array(NUMBER_OF_GENERATED_CARD).fill().map(generateFilm);
const filters = generateFilters(filmsCards);
const profile = generateProfile();

const siteHeader = document.querySelector(`.header`);
const siteMain = document.querySelector(`.main`);
const siteFooter = document.querySelector(`.footer`);

render(siteHeader, new UserTitle(profile).getElement());
render(siteMain, new MainNav(filters).getElement(), RenderPosition.AFTERBEGIN);
render(siteMain, new SortMenu().getElement());
render(siteMain, new FilmsBoard().getElement());
render(siteFooter, new NumberOfFilms(MOVIES_COUNT).getElement());

const filmsBoard = siteMain.querySelector(`.films`);

render(filmsBoard, new FilmsSection().getElement());

const filmsSection = filmsBoard.querySelector(`.films-list`);
const filmsContainer = filmsSection.querySelector(`.films-list__container`);

const createNoDataMessage = () => {
  render(filmsSection, new NoFilmsMessage().getElement());
};

const popupHandler = (getPopup, removePopup) => {
  const closeElement = getPopup.querySelector(`.film-details__close-btn`);

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      deletePopup();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const deletePopup = () => {
    document.querySelector(`.film-details`).remove();
    removePopup;
    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  const createPopup = () => {
    const popup = document.querySelector(`.film-details`);
    document.addEventListener(`keydown`, onEscKeyDown);

    if (popup) {
      deletePopup();
    }

    render(siteFooter, getPopup, RenderPosition.AFTEREND);

    closeElement.addEventListener(`click`, deletePopup);
  };

  createPopup();
};

const renderFilm = (film, containerElement = filmsContainer) => {
  const filmCardComponent = new FilmsCard(film);
  const filmPopupComponent = new PopupFilmDetails(film);
  const createPopupMethod = filmPopupComponent.getElement();
  const removePopupMethod = filmPopupComponent.removeElement();
  const clickHandlerByCardElements = () => {
    popupHandler(createPopupMethod, removePopupMethod);
  };

  filmCardComponent
    .getElement()
    .querySelector(`.film-card__poster`)
    .addEventListener(`click`, clickHandlerByCardElements);
  filmCardComponent
    .getElement()
    .querySelector(`.film-card__title`)
    .addEventListener(`click`, clickHandlerByCardElements);
  filmCardComponent
    .getElement()
    .querySelector(`.film-card__comments`)
    .addEventListener(`click`, clickHandlerByCardElements);

  render(containerElement, filmCardComponent.getElement());
};

const createFilmsBoard = () => {
  const TASK_COUNT_PER_STEP = 5;

  if (!filmsCards.length) {
    createNoDataMessage();
    return;
  }

  for (let i = 0; i < TASK_COUNT_PER_STEP; i++) {
    renderFilm(filmsCards[i]);
  }

  render(filmsSection, new ShowMoreButton().getElement());

  const loadMoreButton = filmsSection.querySelector(`.films-list__show-more`);
  let renderedFilmCount = TASK_COUNT_PER_STEP;

  loadMoreButton.addEventListener(`click`, (e) => {
    e.preventDefault();
    filmsCards
      .slice(renderedFilmCount, renderedFilmCount + TASK_COUNT_PER_STEP)
      .forEach((card) => renderFilm(card));

    renderedFilmCount += TASK_COUNT_PER_STEP;

    if (renderedFilmCount >= filmsCards.length) {
      loadMoreButton.remove();
    }
  });

  render(filmsBoard, new TopRatedFilmsExtraSection().getElement());
  render(filmsBoard, new MostCommentedFilmsExtraSection().getElement());

  const extraSections = filmsBoard.querySelectorAll(`.films-list--extra`);

  for (const section of extraSections) {
    const extraSectionFilmsContainer = section.querySelector(
      `.films-list__container`
    );

    for (let i = 0; i < EXTRA_SECTIONS_FILMS_COUNT; i++) {
      renderFilm(
        filmsCards[getRandomInteger(i, NUMBER_OF_GENERATED_CARD)],
        extraSectionFilmsContainer
      );
    }
  }
};

createFilmsBoard();
