import * as Joi from 'joi';

export const createUserDtoSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  age: Joi.number().integer().min(18).max(70).required(),
  password: Joi.string().min(8).required(),
});

export const updateUserDtoSchema = Joi.object({
  username: Joi.string(),
  email: Joi.string().email(),
  age: Joi.number().integer().min(18).max(70),
  password: Joi.string().min(8),
});