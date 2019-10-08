import axios from 'axios';
import dotenv from 'dotenv';
import redis from 'redis';
import { promisify } from 'util';

const client = redis.createClient();
const getAsync = promisify(client.get).bind(client);
const setexAsync = promisify(client.setex).bind(client);

dotenv.config();

const searchEndpoint = 'https://tvjan-tvmaze-v1.p.rapidapi.com/search/shows';
const showsEndpoint = 'https://tvjan-tvmaze-v1.p.rapidapi.com/shows/';

const host = 'tvjan-tvmaze-v1.p.rapidapi.com';
const APIkey = process.env['X-RapidAPI-Key'];

async function searchSeries(query) {
  const result = await getAsync(`search:${query}`);
  if (result) {
    const resultJSON = JSON.parse(result);
    console.log('from cache');
    return resultJSON;
  }
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
  const responseJSON = response.data;
  console.log('from api');
  await setexAsync(`search:${query}`, 86400, JSON.stringify(responseJSON));
  return responseJSON;
}

async function fetchSeries(showId) {
  const result = await getAsync(`series:${showId}`);
  if (result) {
    const resultJSON = JSON.parse(result);
    console.log('from cache');
    return resultJSON;
  }
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
  const responseJSON = response.data;
  console.log('from api');
  await setexAsync(`series:${showId}`, 86400, JSON.stringify(responseJSON));
  return responseJSON;
}

export default { searchSeries, fetchSeries };
