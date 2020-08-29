import FilmsModel from "./model/films.js";
import {Headers, Method} from "./const.js";
import {isSuccessStatus} from "./utils/utils.js";

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getComments(filmId) {
    return this._load({url: `comments/${filmId}`}).then(Api.toJSON);
  }

  getFilms() {
    return this._load({url: `movies`})
      .then(Api.toJSON)
      .then((films) => {
        return films.map(FilmsModel.adaptToClient);
      });
  }

  updateFilm(film) {
    return this._load({
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(FilmsModel.adaptToServer(film)),
      headers: new Headers(Headers),
    })
      .then(Api.toJSON)
      .then(FilmsModel.adaptToClient);
  }

  addComment(film, comment) {
    return this._load({
      url: `comments/${film.id}`,
      method: Method.POST,
      body: JSON.stringify(comment),
      headers: new Headers(Headers),
    })
      .then(Api.toJSON)
      .then(({comments, movie}) => {
        return Object.assign({}, FilmsModel.adaptToClient(movie), {comments});
      });
  }

  deleteComment(commentId) {
    return this._load({
      url: `comments/${commentId}`,
      method: Method.DELETE,
    });
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (!isSuccessStatus(response.status)) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}
