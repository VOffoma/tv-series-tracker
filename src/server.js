import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express from 'express';
import './helpers/db';
import indexRouter from './routes/index';
import userRouter from './routes/user';
import seriesRouter from './routes/series';
import scheduler from './services/cronService/scheduler';

dotenv.config();

const app = express();

app.use(bodyParser.json());


app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/series', seriesRouter);

// eslint-disable-next-line no-unused-vars
app.use((req, res, next) => res.status(404).send('We think you are lost!'));

// Handler from Error 500
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.isBoom) {
    return res.status(err.output.statusCode).json({ error: err.output.payload.message });
  }
  return res.status(500).send({ error: err.message });
});


app.listen(process.env.PORT, () => {
  console.log('server is up and running');
});

scheduler.start();
