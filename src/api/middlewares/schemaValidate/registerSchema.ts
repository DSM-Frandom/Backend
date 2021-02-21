import Joi from "joi";
const enum error {
    EMAIL = '이메일을 확인해 주세요',
    PASSWORD = '비밀번호를 확인해 주세요',
    USERNAME = '닉네임을 확인해 주세요',
    AGE = '나이를 확인해 주세요',
}

export default Joi.object().keys({
    email: Joi.string().email().lowercase().required()
        .messages({
            'string.base': error.EMAIL,
            'string.email': '실제 존재하는 이메일이 아닙니다',
            'string.empty': error.EMAIL,
            'any.required': error.EMAIL,
        }),
    password: Joi.string().min(6).required()
        .messages({
            'string.base': error.PASSWORD,
            'string.min': '비밀번호는 6자 이상으로 해야합니다',
            'string.empty': error.PASSWORD,
            'any.required': error.PASSWORD,
        }),
    username: Joi.string().min(2).required()
        .messages({
            'string.base': error.USERNAME,
            'string.min': '닉네임은 2자 이상으로 해야합니다',
            'string.empty': error.USERNAME,
            'any.required': error.USERNAME,
        }),
    age: Joi.number().min(1).max(100).required()
        .messages({
            'number.base': error.AGE,
            'number.min': '1살 이상으로 해야합니다',
            'number.max': '100살 이하로 해야합니다',
            'string.empty': error.AGE,
            'any.required': error.AGE
        }),
    gender: Joi.string().valid('M', 'W').required(),
}).unknown()