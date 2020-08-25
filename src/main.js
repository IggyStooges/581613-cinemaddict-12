import UserTitle from "./view/user-title.js";
import FilmsBoard from "./view/films-board.js";
import MovieList from "./presenter/movie-list.js";
import MainNavPresenter from "./presenter/filters.js";
import NumberOfFilms from "./view/number-of-films.js";
import {generateProfile} from "./mock/profile.js";
import {render} from "./utils/render.js";
import {MOVIES_COUNT} from "./mock/allmovies.js";
import {generateFilm} from "./mock/film.js";
import FilmsModel from "./model/films.js";
import FiltersModel from "./model/filter.js";

const NUMBER_OF_GENERATED_CARD = 22;

const filmsCards = new Array(NUMBER_OF_GENERATED_CARD).fill().map(generateFilm);

const profile = generateProfile();

const siteHeader = document.querySelector(`.header`);
const siteMain = document.querySelector(`.main`);
const siteFooter = document.querySelector(`.footer`);
const filmsBoard = new FilmsBoard().getElement();

render(siteHeader, new UserTitle(profile));

const filtersModels = new FiltersModel();

render(siteMain, filmsBoard);
render(siteFooter, new NumberOfFilms(MOVIES_COUNT));

const filmsModel = new FilmsModel();
filmsModel.setFilms(filmsCards);

const mainNavPresenter = new MainNavPresenter(siteMain, filtersModels, filmsModel);
mainNavPresenter.init();

const filmsBoardPresenter = new MovieList(filmsBoard, filmsModel, filtersModels);
filmsBoardPresenter.init();
