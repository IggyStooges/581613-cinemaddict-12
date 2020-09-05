import AbstractView from "./abstract.js";

const createMostCommentedFilmsExtraSection = () => {
  return (
    `<section class="films-list--extra films-list--most-commented">
      <h2 class="films-list__title">Most commented</h2>
      <div class="films-list__container">
      </div>
    </section>`
  );
};

export default class MostCommentedFilmsExtraSection extends AbstractView {
  getTemplate() {
    return createMostCommentedFilmsExtraSection();
  }
}
