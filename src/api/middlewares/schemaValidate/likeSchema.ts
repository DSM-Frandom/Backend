import Joi from "joi";

export default Joi.object().keys({
    user_id: Joi.string().required(),
}).unknown()