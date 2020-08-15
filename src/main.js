import UserTitle from "./view/user-title.js";
import MainNav from "./view/main-nav.js";
import FilmsBoard from "./view/films-board.js";
import MovieList from "./presenter/movie-list.js";
import NumberOfFilms from "./view/number-of-films.js";
import {generateFilters} from "./mock/filter.js";
import {generateProfile} from "./mock/profile.js";
import {render} from "./utils/render.js";
import {MOVIES_COUNT} from "./mock/allmovies.js";
import {RenderPosition} from "./utils/render.js";
import {generateFilm} from "./mock/film.js";

const NUMBER_OF_GENERATED_CARD = 22;

const filmsCards = new Array(NUMBER_OF_GENERATED_CARD).fill().map(generateFilm);

const filters = generateFilters(filmsCards);
const profile = generateProfile();

const siteHeader = document.querySelector(`.header`);
const siteMain = document.querySelector(`.main`);
const siteFooter = document.querySelector(`.footer`);
const filmsBoard = new FilmsBoard().getElement();

render(siteHeader, new UserTitle(profile));
render(siteMain, new MainNav(filters), RenderPosition.AFTERBEGIN);
render(siteMain, filmsBoard);
render(siteFooter, new NumberOfFilms(MOVIES_COUNT));

const filmsBoardPresenter = new MovieList(filmsBoard);
filmsBoardPresenter.init(filmsCards);
