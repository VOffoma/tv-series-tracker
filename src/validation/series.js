import Joi from 'joi';

export const searchTermSchema = {
  params: {
    series: Joi.string().alphanum().required(),
  },
};

export const showIdSchema = {
  body: {
    showId: Joi.string().regex(/^[0-9]+$/).required(),
  },
};
