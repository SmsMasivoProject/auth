import Joi from "joi";

export const CreateUserSchema = Joi.object({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    phone: Joi.string().optional(),
    email: Joi.string().email().required(),
    company_name: Joi.string().required(),
    roles: Joi.array().required(),
    refreshToken: Joi.string().optional()
}).options({ abortEarly: false, allowUnknown: true, stripUnknown: true });