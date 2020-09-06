import AbstractView from "./abstract-view.js";

const createTopRatedSection = () => {
  return (
    `<section class="films-list--extra films-list--top-rated">
      <h2 class="films-list__title">Top rated</h2>
      <div class="films-list__container">
      </div>
    </section>`
  );
};
export default class TopRatedSection extends AbstractView {
  getTemplate() {
    return createTopRatedSection();
  }
}
