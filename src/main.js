import UserTitle from "./view/user-title.js";
import FilmsBoard from "./view/films-board.js";
import MovieList from "./presenter/movie-list.js";
import MainNavPresenter from "./presenter/filters.js";
import NumberOfFilms from "./view/number-of-films.js";
import {render, remove} from "./utils/render.js";
import FilmsModel from "./model/films.js";
import FiltersModel from "./model/filter.js";
import Api from "./api/index.js";
import { END_POINT, AUTHORIZATION, UpdateType } from "./const.js";
import Store from "./api/store.js";
import Provider from "./api/provider.js";
import StatisticsView from "./view/statistics.js";

const STORE_PREFIX = `cinemmadict-localstorage`;
const STORE_VER = `v12`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const filmsModel = new FilmsModel();

const siteHeader = document.querySelector(`.header`);
const siteMain = document.querySelector(`.main`);
const siteFooter = document.querySelector(`.footer`);
const filmsBoard = new FilmsBoard().getElement();

const filtersModel = new FiltersModel();

render(siteMain, filmsBoard);

const filmsBoardPresenter = new MovieList(filmsBoard, filmsModel, filtersModel, apiWithProvider);
filmsBoardPresenter.init();


apiWithProvider.getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
    const statistics = new StatisticsView(films);
    const mainNavPresenter = new MainNavPresenter(siteMain, filtersModel, filmsModel, filmsBoardPresenter, statistics);

    mainNavPresenter.init();
    render(siteHeader, new UserTitle(mainNavPresenter.getWatchedCount()));
    render(siteFooter, new NumberOfFilms(films.length));

  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
    mainNavPresenter.init();
    render(siteFooter, new NumberOfFilms(`No`));
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
    .then(() => {
      console.log(`ServiceWorker available`);
    }).catch(() => {
      console.error(`ServiceWorker isn't available`);
    });
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
