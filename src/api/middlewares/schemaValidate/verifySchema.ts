import Joi from "joi";

export default Joi.object().keys({
    email: Joi.string().email().required()
}).unknown()