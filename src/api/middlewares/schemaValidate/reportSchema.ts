import Joi from "joi";

export default Joi.object().keys({
    title: Joi.string().min(1).max(80).required(),
    description: Joi.string().required(),
}).unknown()