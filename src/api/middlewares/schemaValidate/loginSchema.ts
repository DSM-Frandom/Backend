import Joi from "joi";

export default Joi.object().keys({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(6).required(),
}).unknown()