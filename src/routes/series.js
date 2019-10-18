import express from 'express';
import expressJoi from 'express-joi-validator';
import seriesModel from '../models/Series';
import auth from '../middleware/auth';
import dataService from '../services/dataService';
import { searchTermSchema, showIdSchema } from '../validation/series';

const router = express.Router();

router.get('/:series/search', expressJoi(searchTermSchema), async (req, res) => {
  try {
    const data = await dataService.searchSeries(req.params.series);

    if (!data || data.length === 0) {
      return res.status(404).send({ message: 'Series not found' });
    }
    return res.status(200).send({ data });
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

router.get('/favorites', auth, async (req, res) => {
  try {
    const data = await seriesModel.find({ user: req.user._id });
    if (!data || data.length === 0) {
      return res.status(200).send({ message: 'You have not saved any favorite series yet' });
    }
    return res.status(200).send({ data });
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

router.post('/favorites', auth, expressJoi(showIdSchema), async (req, res) => {
  try {
    const result = await dataService.fetchSeries(req.body.showId);
    if (result.status && result.status === 404) {
      return res.status(404).send({ message: 'Series not found' });
    }
    const {
      name, status, runtime, showURL,
    } = result;

    // eslint-disable-next-line no-underscore-dangle
    const userId = req.user._id;

    const series = seriesModel({
      name,
      status,
      runtime,
      showURL,
      showId: result.id,
      scheduleDay: result.schedule.days,
      scheduleTime: result.schedule.time,
      timezone: result.network.country.timezome,
      image: result.image.original,
      user: userId,
    });

    await series.save();
    return res.status(201).send({ series });
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

router.get('/test', async (req, res) => {
  try {
    return res.status(200).send('for test purpose');
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

export default router;
