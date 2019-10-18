import redis from 'redis';
import { promisify } from 'util';
import moment from 'moment';

import seriesModel from '../../models/Series';
import utils from '../../helpers/utils';
import emailService from '../emailService';


const client = redis.createClient();
const getAsync = promisify(client.get).bind(client);
const setexAsync = promisify(client.setex).bind(client);


const fetchSeriesForTheDay = async (day) => {
  let result;
  const seriesForToday = await getAsync(`series:${day}`);
  if (seriesForToday) {
    result = JSON.parse(seriesForToday);
  } else {
    result = await seriesModel.fetchSeriesByDay(day);
    if (result && result.length > 0) {
      await setexAsync(`series:${day}`, 86400, JSON.stringify(result));
    }
  }
  return result;
};

const filterSeriesByTime = (series) => {
  const present = moment();
  const filteredSeries = series.filter((show) => {
    const showTime = moment(show.scheduleTime, 'HH:mm');
    const timeDiff = showTime.diff(present, 'Minute');
    return timeDiff <= 15;
  });

  return filteredSeries;
};

const sendNotification = async () => {
  const today = utils.getTodayName();
  const seriesList = await fetchSeriesForTheDay(today);
  if (seriesList && seriesList.length > 0) {
    const filteredSeriesList = filterSeriesByTime(seriesList);
    console.log(filteredSeriesList.length);
    if (filteredSeriesList && filteredSeriesList.length > 0) {
      filteredSeriesList.forEach(async (series) => {
        console.log(series.user.email);
        const title = 'Your favorite show starts in less than 15 mins';
        const message = `Hi ${series.user.username}. ${series.name} starts in less than 15 minutes. Get ready to have fun!`;
        await emailService.sendEmail(series.user.email, title, message);
      });
    }
  }
};

export default { sendNotification };
