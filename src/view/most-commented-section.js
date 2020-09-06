import AbstractView from "./abstract-view.js";

const createMostCommentedSection = () => {
  return (
    `<section class="films-list--extra films-list--most-commented">
      <h2 class="films-list__title">Most commented</h2>
      <div class="films-list__container">
      </div>
    </section>`
  );
};

export default class MostCommentedSection extends AbstractView {
  getTemplate() {
    return createMostCommentedSection();
  }
}
