import AbstractView from "./abstract.js";

const createShowMoreButton = () => {
  return (
    `<h2 class="films-list__title">There are no movies in our database</h2>`
  );
};

export default class NoFilmsMessage extends AbstractView{
  getTemplate() {
    return createShowMoreButton();
  }
}
