import Joi from "joi";

export const UpdateUserSchema = Joi.object({
    firstname: Joi.string().optional(),
    lastname: Joi.string().optional(),
    phone: Joi.string().optional(),
    email: Joi.string().email().optional(),
    company_name: Joi.string().optional(),
    roles: Joi.array().optional(),
    secret: Joi.string().uuid().optional(),
    key: Joi.string().uuid().optional(),
    blocked: Joi.boolean().optional(),
    refreshToken: Joi.string().allow("", null).optional()
}).options({ abortEarly: false, allowUnknown: true, stripUnknown: true });