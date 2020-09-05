import UserTitle from "./view/user-title.js";
import FilmsBoard from "./view/films-board.js";
import MovieBoard from "./presenter/movie-board.js";
import MainNavPresenter from "./presenter/nav.js";
import NumberOfFilms from "./view/number-of-films.js";
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

const siteHeader = document.querySelector(`.header`);
const siteMain = document.querySelector(`.main`);
const siteFooter = document.querySelector(`.footer`);
const filmsBoard = new FilmsBoard();

const filtersModel = new FiltersModel();

render(siteMain, filmsBoard);

const filmsBoardPresenter = new MovieBoard(filmsBoard, filmsModel, filtersModel, apiWithProvider, api);
filmsBoardPresenter.init();
const mainNavPresenter = new MainNavPresenter(siteMain, filtersModel, filmsModel, filmsBoardPresenter);

mainNavPresenter.init();

apiWithProvider.getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
    const userTitle = new UserTitle(mainNavPresenter.getWatchedCount());

    filmsModel.addObserver(() => {
      userTitle.updateElement(mainNavPresenter.getWatchedCount());
    });

    render(siteHeader, userTitle);
    render(siteFooter, new NumberOfFilms(films.length));
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
    mainNavPresenter.init();
    render(siteFooter, new NumberOfFilms(`No`));
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
    .then(() => {}).catch(() => {
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
