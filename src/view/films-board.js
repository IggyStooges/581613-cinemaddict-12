import AbstractView from "./abstract.js";

const createFilmsBoard = () => {
  return (
    `<section class="films">
    </section>`
  );
};

export default class FilmsBoard extends AbstractView {
  getTemplate() {
    return createFilmsBoard();
  }
}
