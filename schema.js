//Joi is used to make validation in server side before saving it in the database. This schema is different fron the mongodb schema as this schema is used to prevent the error in the server side while saving the data in DB.

const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().allow("", null),
    }).required()
})