import Joi from 'joi';

const userSchema = Joi.object({
  id: Joi.number().integer().positive().optional(), // Optional because it will be auto-incremented
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  passwordConfirmation: Joi.string().valid(Joi.ref('password')).required(),
  role: Joi.string().valid('freelancer', 'client', 'admin').default('client'),
  profilePictureUrl: Joi.string().uri().optional(),
  adress: Joi.string().optional(),
  bio: Joi.string().optional(),
  passwordChangedAt: Joi.date().optional(),
  allowUnknownMessages: Joi.boolean().default(false),
  createdAt: Joi.date().optional(), // Optional because it will be set by default
  updatedAt: Joi.date().optional(), // Optional because it will be set automatically
});

export default userSchema;
