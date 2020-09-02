import AbstractView from "./abstract.js";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {convertUserTitle} from "../utils/utils.js"
import {filter} from "../utils/filter";

const getTopGenre = (films) => getCountedGenres(films)[0].name;

const BAR_HEIGHT = 50;

const GENRES = [
  `Action`,
  `Adventure`,
  `Animation`,
  `Comedy`,
  `Drama`,
  `Family`,
  `Horror`,
  `Sci-Fi`,
  `Thriller`,
];

const TIME_FILTER = {
  ALLTIME: {
    name: `All time`,
    label: `all-time`,
  },
  TODAY: {
    name: `Today`,
    label: `today`,
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
  const watchedFilms = filter[`history`](films);
  console.log(filter[`history`](films))

  if (period === TIME_FILTER.ALLTIME.label) {
    return watchedFilms;
  }

  const startOfPeriod = moment().startOf(period);

  return watchedFilms.filter((film) => moment(film.watchingDate).isAfter(startOfPeriod));
};

const renderChart = (films, statisticCtx, genres) => {
  statisticCtx.height = BAR_HEIGHT * genres.length;

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

const getCountedGenres = (films) => {
  const genres = film.genre;
  const values = GENRES.map((genre) =>
    films.filter((film) =>
      film.genre.includes(genre))
      .length);

  const genresCount = [];
  GENRES.forEach((genre, i) => genresCount.push(
      {
        name: genre,
        count: values[i],
      }));

  const sortedGenresCount = genresCount.sort((a, b) => b.count - a.count);

  return sortedGenresCount;
};

const createFilterMarkup = (filter, isCkecked) => {
  const {name, label} = filter;

  return (
    `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${label}" value="${label}" ${isCkecked ? `checked` : ``}>
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
  for (const filter in TIME_FILTER) {
    if (filter) {
      timeFiltersMarkup = timeFiltersMarkup.concat(createFilterMarkup(TIME_FILTER[filter], currentFilter === TIME_FILTER[filter].label));
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

    this._dateChangeHandler = this._dateChangeHandler.bind(this);

    this._setCharts();
  }

  removeElement() {
    super.removeElement();

    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }
  }

  getTemplate() {
    return createStatisticsTemplate(getWatchedFilmsByPeriod(this._films, this._currentTimeFilter), this._currentTimeFilter);
  }

  restoreHandlers() {
    this._setCharts();
    this._setDatepicker();
  }

  _dateChangeHandler([dateFrom, dateTo]) {
    if (!dateFrom || !dateTo) {
      return;
    }

    this.updateData({
      dateFrom,
      dateTo
    });
  }

  _setDatepicker() {
    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }

    this._datepicker = flatpickr(
        this.getElement().querySelector(`.statistic__period-input`),
        {
          mode: `range`,
          dateFormat: `j F`,
          defaultDate: [this._data.dateFrom, this._data.dateTo],
          onChange: this._dateChangeHandler
        }
    );
  }

  _setCharts() {

  }
}
