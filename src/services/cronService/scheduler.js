import cron from 'node-cron';
import tasks from './tasks';

const scheduleFactory = function () {
  return {
    start: () => {
      cron.schedule('*/15 * * * *', () => tasks.sendNotification());
    },
  };
};

export default scheduleFactory();
