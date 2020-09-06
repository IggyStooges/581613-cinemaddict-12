import AbstractView from "./abstract-view.js";

const createNoTaskTemplate = () => {
  return `<p class="board__no-tasks">
    Loading...
  </p>`;
};

export default class Loading extends AbstractView {
  getTemplate() {
    return createNoTaskTemplate();
  }
}
