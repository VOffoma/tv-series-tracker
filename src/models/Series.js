import mongoose from 'mongoose';
import dotenv from 'dotenv';
// import userModel from './User';

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
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: { createdAt: 'created_at' } });

seriesSchema.post('validate', async function () {
  const { showId, name, user } = this;
  // eslint-disable-next-line no-use-before-define
  const existingSeries = await SeriesSchema.findOne({ showId, name, user });
  if (existingSeries) {
    throw new Error('You have already listed this series as a favorite');
  }
});

seriesSchema.statics.fetchSeriesByDay = async function (day) {
  const seriesList = await this.find({ status: 'Running', scheduleDay: day })
    .populate('user', 'email username');
  return seriesList;
};

// seriesSchema.statics.fetchSeriesByDay = async function (day) {
//   const series = await this.aggregate([
//     { $match: { status: 'Running', scheduleDay: day } },
//     { $group: { _id: { user: '$user', scheduleTime: '$scheduleTime' }, shows: { $push: { showName: '$name', showTime: '$scheduleTime', showImage: '$image' } } } },
//     {
//       $lookup: {
//         from: userModel.collection.name, localField: '_id', foreignField: '_id', as: 'users',
//       },
//     },
//     { $unwind: '$users' },
//     {
//       $project: {
//         user: '$users.username', emailAddress: '$users.email', shows: '$shows', _id: 0,
//       },
//     },
//   ]);
//   return series;
// };

// seriesSchema.statics.fetchSeriesByDay = async function (day) {

//   const series = await this.aggregate([
//     { $match: { status: 'Running', scheduleDay: day } },
//     { $group: { _id: '$user', shows: { $push: { showName: '$name', showTime: '$scheduleTime', showImage: '$image' } } } },
//     {
//       $lookup: {
//         from: userModel.collection.name, localField: '_id', foreignField: '_id', as: 'users',
//       },
//     },
//     { $unwind: '$users' },
//     {
//       $project: {
//         user: '$users.username', emailAddress: '$users.email', shows: '$shows', _id: 0,
//       },
//     },
//   ]);
//   return series;
// };

const SeriesSchema = mongoose.model('Series', seriesSchema);
export default SeriesSchema;
