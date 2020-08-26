import Observer from "../utils/observer.js";

export default class FilmsModel extends Observer {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(films) {
    this._films = films.slice();
  }

  getFilms() {
    return this._films;
  }

  updateFilm(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting films`);
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  deleteComment(updateType, updateFilm, commentIndex) {
    const filmIndex = this._films.findIndex((film) => film.id === updateFilm.id);

    if (filmIndex === -1) {
      throw new Error(`Can't update unexisting films`);
    }

    this._films[filmIndex] = Object.assign({}, this._films[filmIndex], {
      comments: [
        ...this._films.slice()[filmIndex].comments.slice(0, commentIndex),
        ...this._films.slice()[filmIndex].comments.slice(commentIndex + 1)
      ]
    });

    this._notify(updateType, updateFilm);
  }

  addComment(updateType, updateFilm, newComment) {
    const filmIndex = this._films.findIndex((film) => film.id === updateFilm.id);

    this._films[filmIndex].comments = [...this._films[filmIndex].comments, newComment];

    this._notify(updateType, updateFilm);
  }
}
