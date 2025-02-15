const Joi = require('joi') ; 

const listingSchema = Joi.object({
    listing : Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.string().allow("" , null).default("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1vdW50YWlufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"),
        price: Joi.number().min(1).required(),
        location: Joi.string().required(),
        country: Joi.string().required()
    }).required()
}); 