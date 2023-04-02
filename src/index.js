import './css/styles.css';
import { debounce } from 'lodash';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener('input', debounce(handleInput, DEBOUNCE_DELAY));

function handleInput(event) {
  const searchCountry = event.target.value.trim();
  fetchCountries(searchCountry)
    .then(data => {
      if (data.length >= 10) {
        Notify.info('Too many matches found. Please enter a more specific name.');
        return;
      }
      formListAndInfo(data);
    })
    .catch(() => {
      Notify.failure('Oops, there is no country with that name.');
    });
}

function formListAndInfo(data) {
  const inputCountry = data
    .map(({ name, flags }) => {
      return `<li><h1>${name.common}</h1></li><li><img src="${flags.svg}" alt="прапор" width="150px"></li>`;
    })
    .join('');
  countryList.innerHTML = inputCountry;
  const inputInfo = data
    .map(({ capital, population, languages }) => {
      const languagesAll = Object.values(languages).map(value => `<li>${value}</li>`).join('');
      return `<p>Столиця: ${capital}</p><p>Населення: ${population}</p><h2>Мови:</h2><ul>${languagesAll}</ul> `;
    })
    .join('');
  countryInfo.innerHTML = inputInfo;
}
