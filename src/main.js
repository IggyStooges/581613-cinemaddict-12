import UserTitle from "./view/user-title.js";
import FilmsBoard from "./view/films-board.js";
import MovieList from "./presenter/movie-list.js";
import MainNavPresenter from "./presenter/filters.js";
import NumberOfFilms from "./view/number-of-films.js";
import {generateProfile} from "./mock/profile.js";
import {render} from "./utils/render.js";
import FilmsModel from "./model/films.js";
import FiltersModel from "./model/filter.js";
import Api from "./api/index.js";
import {END_POINT, AUTHORIZATION, UpdateType} from "./const.js";
import Store from "./api/store.js";
import Provider from "./api/provider.js";
const STORE_PREFIX = `cinemmadict-localstorage`;
const STORE_VER = `v12`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const filmsModel = new FilmsModel();

const profile = generateProfile();

const siteHeader = document.querySelector(`.header`);
const siteMain = document.querySelector(`.main`);
const siteFooter = document.querySelector(`.footer`);
const filmsBoard = new FilmsBoard().getElement();

render(siteHeader, new UserTitle(profile));

const filtersModel = new FiltersModel();

render(siteMain, filmsBoard);

const mainNavPresenter = new MainNavPresenter(siteMain, filtersModel, filmsModel);

const filmsBoardPresenter = new MovieList(filmsBoard, filmsModel, filtersModel, apiWithProvider);
filmsBoardPresenter.init();

apiWithProvider.getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
    mainNavPresenter.init();
    render(siteFooter, new NumberOfFilms(films.length));
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
    mainNavPresenter.init();
    render(siteFooter, new NumberOfFilms(`No`));
  });

  window.addEventListener(`load`, () => {
    navigator.serviceWorker.register(`./sw.js`)
      .then(() => {
        console.log(`ServiceWorker available`); // eslint-disable-line
      }).catch(() => {
        console.error(`ServiceWorker isn't available`); // eslint-disable-line
      });
  });

  window.addEventListener(`online`, () => {
    document.title = document.title.replace(` [offline]`, ``);
    apiWithProvider.sync();
  });

  window.addEventListener(`offline`, () => {
    document.title += ` [offline]`;
  });
