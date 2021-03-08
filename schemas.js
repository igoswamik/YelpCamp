const Joi=require('joi');

//define Joi schema

  module.exports.campgroundSchema=Joi.object({
    campground: Joi.object({
          title: Joi.string().required(),
          price: Joi.number().required().min(0),
          image: Joi.string().required(),
          location: Joi.string().required(),
          description: Joi.string().required()
      }).required()
  });