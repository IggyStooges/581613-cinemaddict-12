import UserTitle from "./view/user-title.js";
import FilmsBoard from "./view/films-board.js";
import MovieList from "./presenter/movie-list.js";
import MainNavPresenter from "./presenter/filters.js";
import NumberOfFilms from "./view/number-of-films.js";
import {generateProfile} from "./mock/profile.js";
import {render} from "./utils/render.js";
import FilmsModel from "./model/films.js";
import FiltersModel from "./model/filter.js";
import Api from "./api.js";
import {END_POINT, AUTHORIZATION, UpdateType} from "./const.js";

const api = new Api(END_POINT, AUTHORIZATION);
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

const filmsBoardPresenter = new MovieList(filmsBoard, filmsModel, filtersModel, api);

api.getFilms()
  .then((films) => {
    const promiseses = [];
    films.forEach((element) => {
      promiseses.push(api.getComments(element.id));
    });
    Promise.all(promiseses).then((receivedComments) => {
      const uploadedFilms = [];
      for (let film of films) {
        film = Object.assign({}, film, {
          comments: receivedComments[[Number(film.id)]]
        });
        uploadedFilms.push(film);
      }
      filmsModel.setFilms(UpdateType.INIT, uploadedFilms);
      mainNavPresenter.init();
      render(siteFooter, new NumberOfFilms(uploadedFilms.length));
    });
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
    mainNavPresenter.init();
    render(siteFooter, new NumberOfFilms(`No`));
  });

filmsBoardPresenter.init();
