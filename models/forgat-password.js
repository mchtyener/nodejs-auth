const mongoose = require('mongoose')
const joi = require("joi");

const forgotPasswordSchema = new mongoose.Schema({
    email: {type: String, required: true, trim: true, unique: true, match: /^\S+@\S+\.\S+$/},
    verification: {type: String},
    expires: {type: Date, default: Date.now, expires: 60}
});

const validateForgotPassword = (data) => {
    const schema = joi.object({
        email: joi.string().empty().email().required().messages({
            "string.base": "E-posta alanı metinsel (string) bir değer olmak zorunda.",
            "string.empty": "E-posta alanı boş bırakılamaz.",
            "string.email": "Geçerli bir e-posta adresi giriniz.",
            "string.required": "E-posta alanı zorunludur."
        }),
    });
    return schema.validate(data, {abortEarly: false})
}
const forgot_password = mongoose.model('forgot-password', forgotPasswordSchema)
module.exports = {forgot_password, validateForgotPassword}
