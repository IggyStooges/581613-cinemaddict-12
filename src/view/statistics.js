import AbstractView from "./abstract.js";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {convertUserTitle} from "../utils/utils.js";
import {filter} from "../utils/filter";
import {FiltersType} from "../const.js";
import moment from "moment";

const getTopGenre = (films) => getCountedGenres(films)[0].name;

const BAR_HEIGHT = 50;

const getExclusiveGenres = (films) => {
  return Array.from(new Set(getGenres(films)));
};

const TIME_FILTER = {
  ALLTIME: {
    name: `All time`,
    label: `all-time`,
  },
  TODAY: {
    name: `Today`,
    label: `day`,
  },
  WEEK: {
    name: `Week`,
    label: `week`,
  },
  MONTH: {
    name: `Month`,
    label: `month`,
  },
  YEAR: {
    name: `Year`,
    label: `year`,
  },
};

const getWatchedFilmsByPeriod = (films, period) => {
  const watchedFilms = filter[FiltersType.WATCHED](films);

  if (period === TIME_FILTER.ALLTIME.label) {
    return watchedFilms;
  }

  const startOfPeriod = moment().startOf(period);

  return watchedFilms.filter((film) => moment(film.watchingDate).isAfter(startOfPeriod));
};

const renderChart = (films, statisticCtx) => {

  statisticCtx.height = BAR_HEIGHT * getExclusiveGenres(films).length;

  if (!films.length) {
    return `No movies`;
  }

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: getCountedGenres(films).map((genre) => genre.name),
      datasets: [{
        data: getCountedGenres(films).map((genre) => genre.count),
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 24
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

const getGenres = (films) => {
  const allGenres = films.map((film) => film.genre);

  return allGenres.flat();
};

const getCountedGenres = (films) => {
  const exlusiveGenres = getExclusiveGenres(films);

  const values = exlusiveGenres.map((genre) =>
    films.filter((film) =>
      film.genre.includes(genre))
      .length);

  const genresCount = [];

  exlusiveGenres.forEach((genre, i) => genresCount.push(
      {
        name: genre,
        count: values[i],
      }));

  return genresCount.sort((a, b) => b.count - a.count);
};

const createStatisticFilterMarkup = (statisticFilter, isChecked) => {
  const {name, label} = statisticFilter;

  return (
    `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${label}" value="${label}" ${isChecked ? `checked` : ``}>
    <label for="statistic-${label}" class="statistic__filters-label for="statistic-${label}">${name}</label>`
  );
};

const createStatisticsTemplate = (films, currentFilter) => {
  const duration = films.reduce((filmsDuration, film) => {
    filmsDuration += film.runtime;
    return filmsDuration;
  }, 0);

  const durationHours = Math.floor(duration / 60);
  const durationMinutes = duration % 60;

  let timeFiltersMarkup = ``;
  for (const timefilter in TIME_FILTER) {
    if (timefilter) {
      timeFiltersMarkup = timeFiltersMarkup.concat(createStatisticFilterMarkup(TIME_FILTER[timefilter], currentFilter === TIME_FILTER[timefilter].label));
    }
  }

  const topGenre = films.length > 0 ? getTopGenre(films) : ``;
  const rank = convertUserTitle(films.length);

  return (
    `<section class="statistic">
      <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">${rank}</span>
      </p>
      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>
        ${timeFiltersMarkup}
      </form>
      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${films.length} <span class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">${durationHours} <span class="statistic__item-description">h</span> ${durationMinutes} <span class="statistic__item-description">m</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${topGenre}</p>
        </li>
      </ul>
      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>
    </section>`
  );
};

export default class StatisticsView extends AbstractView {
  constructor(films) {
    super();

    this._films = films;
    this._currentTimeFilter = TIME_FILTER.ALLTIME.label;

    this._allWatchedFilms = getWatchedFilmsByPeriod(this._films, TIME_FILTER.ALLTIME.label);

    this._changePeriodClickHandler = this._changePeriodClickHandler.bind(this);
    this._setCharts = this._setCharts.bind(this);
    this._ctx = this.getElement().querySelector(`.statistic__chart`);

    this._setCharts(this._allWatchedFilms, this._ctx);
  }

  _changePeriodClickHandler(evt) {
    evt.preventDefault();
    this._currentTimeFilter = evt.target.value;
    this._filmsByPeriod = getWatchedFilmsByPeriod(this._films, this._currentTimeFilter);
    this.updateElement();
  }

  setPeriodClickHandler() {
    this.getElement().querySelector(`.statistic__filters`).addEventListener(`change`, this._changePeriodClickHandler);
  }

  getTemplate() {
    return createStatisticsTemplate(getWatchedFilmsByPeriod(this._films, this._currentTimeFilter), this._currentTimeFilter);
  }

  updateElement() {
    let prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);
    prevElement = null;

    this.restoreHandlers();
    this._setCharts(this._filmsByPeriod, this._ctx);
  }

  restoreHandlers() {
    this.setPeriodClickHandler();
    this._ctx = this.getElement().querySelector(`.statistic__chart`);
  }

  _setCharts(films, ctx) {
    renderChart(films, ctx);
  }
}
