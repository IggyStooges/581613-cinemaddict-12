import Observer from "../utils/observer.js";

export default class FilmsModel extends Observer {
  constructor() {
    super();
    this._films = [];
  }

  static adaptToClient(film) {
    const adaptedFilm = Object.assign(
      {},
      film,
      {
        isWatched: film.user_details.already_watched,
        isFavorite: film.user_details.favorite,
        isWatchList: film.user_details.watchlist,
        age: film.film_info.age_rating,
        originalTitle: film.film_info.alternative_title,
        country: film.film_info.release.release_country,
        date: film.film_info.release.date,
        rating: film.film_info.total_rating,
        author: film.film_info.director,
        ...film.film_info,
        actors: film.film_info.actors.join(),
        writers: film.film_info.writers.join(),
        ...film.user_details,
      }
  );

  // Ненужные ключи мы удаляем
  delete adaptedFilm.already_watched;
  delete adaptedFilm.favorite;
  delete adaptedFilm.watchlist;
  delete adaptedFilm.user_details;
  delete adaptedFilm.age_rating;
  delete adaptedFilm.alternative_title;
  delete adaptedFilm.film_info;

  // delete adaptedTask.is_archived;
  // delete adaptedTask.is_favorite;
  // delete adaptedTask.repeating_days;

  return adaptedFilm;
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
