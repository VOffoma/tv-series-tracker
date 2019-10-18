import Joi from 'joi';

export const userSchema = {
  body: {
    username: Joi.string().alphanum().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  },
};

export const userCredentialsSchema = {
  body: {
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  },
};
