import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const searchEndpoint = 'https://tvjan-tvmaze-v1.p.rapidapi.com/search/shows';
const showsEndpoint = 'https://tvjan-tvmaze-v1.p.rapidapi.com/shows/';

const host = 'tvjan-tvmaze-v1.p.rapidapi.com';
const APIkey = process.env['X-RapidAPI-Key'];

async function searchSeries(query) {
  const response = await axios({
    method: 'GET',
    url: searchEndpoint,
    headers: {
      'content-type': 'application/octet-stream',
      'x-rapidapi-host': host,
      'x-rapidapi-key': APIkey,
    },
    params: {
      q: query,
    },
  });

  return response.data;
}

async function fetchSeries(showId) {
  const showUrl = `${showsEndpoint}${showId}`;
  const response = await axios({
    method: 'GET',
    url: showUrl,
    headers: {
      'content-type': 'application/octet-stream',
      'x-rapidapi-host': host,
      'x-rapidapi-key': APIkey,
    },
  });
  return response.data;
}

export default { searchSeries, fetchSeries };
