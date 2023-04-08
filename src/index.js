
import './css/styles.css';
import { debounce } from 'lodash';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');

input.addEventListener('input', debounce(handleInput, DEBOUNCE_DELAY));

function handleInput(event) {
  const searchCountry = event.target.value.trim();
  if (!searchCountry) {
    countryList.innerHTML = '';
    return;
  }
  fetchCountries(searchCountry)
    .then(data => {
      if (data.length >= 10) {
        countryList.innerHTML = '';
        Notify.info('Too many matches found. Please enter a more specific name.');
        return;
      }
      formListAndInfo(data);
    })
    .catch(error => {
      if (error.message === "404") {
        countryList.innerHTML = '';
        Notify.failure('Oops, there is no country with that name.');
      }
    });
}

function formListAndInfo(data) {
  countryList.innerHTML = data.map(({ name, flags, capital, population, languages }) => `
    <li>
      <h1>${name.common}</h1>
      <img src="${flags.svg}" alt="прапор" width="150px">
      <div>
        <p>Столица: ${capital}</p>
        <p>Население: ${population}</p>
        <ul>
          <h2>Мови:</h2>
          ${Object.values(languages).map(value => `<li>${value}</li>`).join('')}
        </ul>
      </div>
    </li>
  `).join('');
}

