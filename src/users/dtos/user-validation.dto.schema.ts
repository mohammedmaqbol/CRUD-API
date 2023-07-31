import * as Joi from 'joi'; 

export const createUserDtoSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().required().email(),
  password: Joi.string().min(8).required(),
});

export const updateUserDtoSchema = Joi.object({
  username: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string().min(8),
});