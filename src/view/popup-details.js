import AbstractView from "./abstract.js";
import {render, createElement} from "../utils/render.js";
import {Emojies} from "../const.js";

const fillCommentsList = (comments) => {
  let commentsList = ``;
  for (let comment of comments) {
    commentsList = commentsList.concat(
        `<li class="film-details__comment">
        <span class="film-details__comment-emoji">
            <img src="./images/emoji/${comment.emodji}.png" alt="emoji-sleeping" width="55" height="55">
        </span>
        <div>
            <p class="film-details__comment-text">${comment.text}</p>
            <p class="film-details__comment-info">
            <span class="film-details__comment-author">${comment.author}</span>
            <span class="film-details__comment-day">${comment.date}</span>
            <button class="film-details__comment-delete">Delete</button>
            </p>
        </div>
        </li>`
    );
  }
  return commentsList;
};

const fillGenresList = (genres) => {
  let genresList = ``;
  for (let genre of genres) {
    genresList = genresList.concat(`<span class="film-details__genre">${genre}</span>`);
  }
  return genresList;
};

const createPopupFilmDetails = (film, emoji) => {
  const {
    descriptions,
    poster,
    title,
    originalTitle,
    rating,
    comments,
    age,
    author,
    writers,
    actors,
    date,
    isWatched,
    isFavorite,
    isWatchList,
    duration,
    country,
    genres,
  } = film;

  return `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="${poster}" alt="">
              <p class="film-details__age">${age}+</p>
            </div>
            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">${originalTitle}</p>
                </div>
                <div class="film-details__rating">
                  <p class="film-details__total-rating">${rating}</p>
                </div>
              </div>
              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${author}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${writers}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${actors}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${date.toLocaleString(`en-JM`, {month: `long`, day: `numeric`, year: `numeric`})}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${duration}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${country}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Genres</td>
                  <td class="film-details__cell">
                    ${fillGenresList(genres)}
                  </td>
                </tr>
              </table>
              <p class="film-details__film-description">
                ${descriptions}
              </p>
            </div>
          </div>
          <section class="film-details__controls">
            <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${isWatchList ? `checked` : ``}>
            <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>
            <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${isWatched ? `checked` : ``}>
            <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>
            <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${isFavorite ? `checked` : ``}>
            <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
          </section>
        </div>
        <div class="form-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
            <ul class="film-details__comments-list">
              ${fillCommentsList(comments)}
            </ul>
            <div class="film-details__new-comment">
              <div for="add-emoji" class="film-details__add-emoji-label">
              ${emoji ? `<img src="./images/emoji/${emoji}.png" alt="emoji-${emoji}" style="font-size:10px;" width="30" height="30">` : ``}
              </div>
              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
              </label>
              <div class="film-details__emoji-list">
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${emoji === Emojies.SMILE ? `checked` : ``}>
                <label class="film-details__emoji-label" for="emoji-smile" data-emoji="smile">
                  <img src="./images/emoji/smile.png" alt="emoji-smile" style="font-size:10px;" width="30" height="30" data-emoji="smile">
                </label>
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping"${emoji === Emojies.sleeping ? `checked` : ``}>
                <label class="film-details__emoji-label" for="emoji-sleeping" data-emoji="sleeping">
                  <img src="./images/emoji/sleeping.png" alt="emoji-sleeping" style="font-size:10px;" width="30" height="30" data-emoji="sleeping">
                </label>
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${emoji === Emojies.puke ? `checked` : ``}>
                <label class="film-details__emoji-label" for="emoji-puke" data-emoji="puke">
                  <img src="./images/emoji/puke.png" alt="emoji-puke" style="font-size:10px;" width="30" height="30" data-emoji="puke">
                </label>
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${emoji === Emojies.angry ? `checked` : ``}>
                <label class="film-details__emoji-label" for="emoji-angry" data-emoji="angry">
                  <img src="./images/emoji/angry.png" alt="emoji-angry" style="font-size:10px;" width="30" height="30" data-emoji="angry">
                </label>
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>`;
};

export default class PopupFilmDetails extends AbstractView {
  constructor(film, emojie) {
    super();

    this._film = film;
    this._emojie = emojie;
    this._clickHandler = this._clickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._emojiesToggleHandler = this._emojiesToggleHandler.bind(this);

    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);

    this._enableEmojieseToggler();
  }

  _emojiesToggleHandler(evt) {
    evt.preventDefault();

    const element = this.getElement();
    const selectedEmojiId = evt.target.dataset.emoji;

    const emojiContainer = element.querySelector(`.film-details__add-emoji-label`);
    if (emojiContainer.firstElementChild) {
      emojiContainer.firstElementChild.remove();
    }

    const emojiesTemplate = (evt.target.tagName === `IMG`) ? evt.target.outerHTML : evt.target.innerHTML.trim();
    const emojiesElement = createElement(emojiesTemplate);

    render(emojiContainer, emojiesElement);
    element.querySelector(`#emoji-${selectedEmojiId}`).checked = true;
    this._emojie = selectedEmojiId;
  }

  _enableEmojieseToggler() {
    this.getElement()
      .querySelectorAll(`.film-details__emoji-label`).forEach((element) => {
        element.addEventListener(`click`, this._emojiesToggleHandler);
      });
  }

  restoreHandlers() {
    this._enableEmojieseToggler();
  }

  restoreEmoji() {
    return this._emojie;
  }

  getTemplate() {
    return createPopupFilmDetails(this._film, this._emojie);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._favoriteClick();
  }

  setFavoriteClickHandler(callback) {
    this._favoriteClick = callback;
    this.getElement().querySelector(`.film-details__control-label--favorite`).addEventListener(`click`, this._favoriteClickHandler);
  }

  _watchedClickHandler(evt) {
    evt.preventDefault();
    this._watchedClick();
  }

  setWatchedClickHandler(callback) {
    this._watchedClick = callback;
    this.getElement().querySelector(`.film-details__control-label--watched`).addEventListener(`click`, this._watchedClickHandler);
  }

  _watchlistClickHandler(evt) {
    evt.preventDefault();
    this._watchlistClick();
  }

  setWatchlistClickHandler(callback) {
    this._watchlistClick = callback;
    this.getElement().querySelector(`.film-details__control-label--watchlist`).addEventListener(`click`, this._watchlistClickHandler);
  }


  setCloseClickHandler(elementQuery, callback) {
    this._callback = callback;
    this.getElement().querySelector(elementQuery).addEventListener(`click`, this._clickHandler);
  }
}
