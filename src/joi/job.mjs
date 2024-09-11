import Joi from 'joi';

const jobSchema = Joi.object({
  id: Joi.number().integer().positive().optional(), // Optional because it will be auto-incremented
  title: Joi.string().required(),
  description: Joi.string().required(),
  budget: Joi.number().required().positive().required(),
  paymentType: Joi.string().valid('hourly', 'fixed').required(),
  status: Joi.string()
    .valid('open', 'progress', 'complated', 'closed')
    .default('open'),
  employerId: Joi.number().integer().positive().required(), // Foreign key reference to User
});

export default jobSchema;
