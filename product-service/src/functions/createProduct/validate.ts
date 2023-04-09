import Joi from 'joi';

export const schema = Joi.object().keys({
  title: Joi.string().min(1).required(),
  price: Joi.number().positive().required(),
  description: Joi.string().min(1).required(),
  image: Joi.string().uri().required(),
  count: Joi.number().integer().min(1).required(),
});
