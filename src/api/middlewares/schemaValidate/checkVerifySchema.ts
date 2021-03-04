import Joi from "joi";

export default Joi.object().keys({
    verify: Joi.string().required()
}).unknown()