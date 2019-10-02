import express from 'express';
import expressJoi from 'express-joi-validator';
import seriesModel from '../models/Series';
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

router.get('/favorites', async (req, res) => {
  try {
    const data = await seriesModel.find({});
    if (!data || data.length === 0) {
      return res.status(200).send({ message: 'You have not saved any favorite series yet' });
    }
    return res.status(200).send({ data });
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

router.post('/favorites', expressJoi(showIdSchema), async (req, res) => {
  try {
    const result = await dataService.fetchSeries(req.body.showId);
    if (result.status && result.status === 404) {
      return res.status(404).send({ message: 'Series not found' });
    }
    const {
      name, status, runtime, showURL,
    } = result;

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
    });

    await series.save();
    return res.status(201).send({ series });
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

export default router;
