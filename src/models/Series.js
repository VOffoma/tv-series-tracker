import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();


const seriesSchema = mongoose.Schema({
  showId: Number,
  name: String,
  status: String,
  scheduleDay: [String],
  scheduleTime: String,
  timezone: String,
  runtime: Number,
  image: String,
  showURL: String,
}, { timestamps: { createdAt: 'created_at' } });

seriesSchema.post('validate', async function (next) {
  const { showId, name } = this;
  // eslint-disable-next-line no-use-before-define
  const existingSeries = await SeriesSchema.findOne({ showId, name });
  if (existingSeries) {
    throw new Error('You have already listed this series as a favorite');
  }
  next();
});

const SeriesSchema = mongoose.model('Series', seriesSchema);
export default SeriesSchema;
