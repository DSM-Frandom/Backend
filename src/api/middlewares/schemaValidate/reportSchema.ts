import Joi from "joi";

const enum error {
    TITLE = "제목을 확인해 주세요",
    DESCRIPTION = "내용을 확인해 주세요"
}

export default Joi.object().keys({
    title: Joi.string().min(1).max(80).required()
        .messages({
            'string.base': error.TITLE,
            'string.min': error.TITLE,
            'string.max': "제목을 80자 이하로 입력해주세요",
            'any.required': error.TITLE
        }),
    description: Joi.string().required()
        .messages({
            'string.base': error.DESCRIPTION,
            'any.required': error.DESCRIPTION
        }),
}).unknown()