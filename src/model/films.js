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
          director: film.film_info.director,
          poster: film.film_info.poster,
          runtime: film.film_info.runtime,
          title: film.film_info.title,
          genre: film.film_info.genre,
          description: film.film_info.description,
          isWatched: film.user_details.already_watched,
          isFavorite: film.user_details.favorite,
          isWatchList: film.user_details.watchlist,
          watchingDate: film.user_details.watching_date,
          age: film.film_info.age_rating,
          originalTitle: film.film_info.alternative_title,
          country: film.film_info.release.release_country,
          date: film.film_info.release.date,
          rating: film.film_info.total_rating,
          actors: film.film_info.actors.join(),
          writers: film.film_info.writers.join(),
          commentsIds: film.comments
        }
    );

    delete adaptedFilm.already_watched;
    delete adaptedFilm.favorite;
    delete adaptedFilm.watchlist;
    delete adaptedFilm.user_details;
    delete adaptedFilm.age_rating;
    delete adaptedFilm.alternative_title;
    delete adaptedFilm.film_info;
    return adaptedFilm;
  }

  static adaptToServer(film) {
    const adaptedFilm = Object.assign(
        {},
        film,
        {
          "comments": film.commentsIds,
          "user_details": {
            "already_watched": film.isWatched,
            "favorite": film.isFavorite,
            "watchlist": film.isWatchList,
            "watching_date": film.watchingDate
          },
          "film_info": {
            "description": film.description,
            "director": film.director,
            "actors": film.actors.split(`,`),
            "writers": film.writers.split(`,`),
            "alternative_title": film.originalTitle,
            "age_rating": film.age,
            "total_rating": film.rating,
            "release": {
              "release_country": film.country,
              "date": film.date
            },
            "genre": film.genre,
            "poster": film.poster,
            "runtime": film.runtime,
            "title": film.title
          }
        }
    );

    delete adaptedFilm.isFavorite;
    delete adaptedFilm.description;
    delete adaptedFilm.director;
    delete adaptedFilm.genre;
    delete adaptedFilm.poster;
    delete adaptedFilm.runtime;
    delete adaptedFilm.total_rating;
    delete adaptedFilm.release;
    delete adaptedFilm.genre;
    delete adaptedFilm.title;
    delete adaptedFilm.isWatchList;
    delete adaptedFilm.isWatched;
    delete adaptedFilm.country;
    delete adaptedFilm.date;
    delete adaptedFilm.country;
    delete adaptedFilm.rating;
    delete adaptedFilm.age;
    delete adaptedFilm.originalTitle;
    delete adaptedFilm.writers;
    delete adaptedFilm.actors;
    delete adaptedFilm.commentsIds;
    delete adaptedFilm.watching_date;

    return adaptedFilm;
  }

  setFilms(updateType, films) {
    this._films = films.slice();

    this._notify(updateType);
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

  deleteComment(updateType, updateFilm, deleteCommentId) {
    const filmIndex = this._films.findIndex((film) => film.id === updateFilm.id);
    const commentIndex = updateFilm.commentsIds.findIndex((comment) => comment === deleteCommentId);

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

  addComment(updateType, updateFilm, newComments) {
    const filmIndex = this._films.findIndex((film) => film.id === updateFilm.id);

    this._films[filmIndex].comments = newComments;
    this._films[filmIndex].commentsIds = newComments.map((comment) => comment.id);

    this._notify(updateType, updateFilm);
  }
}
