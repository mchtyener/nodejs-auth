const mongoose = require('mongoose')
const joi = require("joi");

const userSchema = new mongoose.Schema({
    firstName: {type: String, required: true, trim: true},
    lastName: {type: String, required: true, trim: true},
    email: {type: String, required: true, trim: true, unique: true, match: /^\S+@\S+\.\S+$/},
    password: {type: String, required: true, trim: true},
    role: {
        type: [String],
        required: false,
        trim: true,
        default: ['ROLE_USER'],
        enum: ['ROLE_USER', 'ROLE_ADMIN']
    },
    isActive: {type: Boolean, default: false},
});

const validateUser = (data) => {
    const passwordComplexity = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const schema = joi.object({

        firstName: joi.string().empty().min(3).max(100).required().messages({
            "string.base": "İsim alanı metinsel(string) bir değer olmak zorunda.",
            "string.empty": "İsim alanı boş bırakılamaz.",
            "string.max": "Maximum 100 karakter girebilirsiniz.",
            "string.min": "Minimum 3 karakterden oluşturabilirsiniz.",
            "string.required": "İsim alanı zorunludur."
        }),
        lastName: joi.string().empty().min(3).max(100).required().messages({
            "string.base": "Soyadı alanı metinsel(string) bir değer olmak zorunda.",
            "string.empty": "Soyadı alanı boş bırakılamaz.",
            "string.max": "Maximum 100 karakter girebilirsiniz.",
            "string.min": "Minimum 3 karakterden oluşturabilirsiniz.",
            "string.required": "Soyadı alanı zorunludur."
        }),
        email: joi.string().empty().email().required().messages({
            "string.base": "E-posta alanı metinsel (string) bir değer olmak zorunda.",
            "string.empty": "E-posta alanı boş bırakılamaz.",
            "string.email": "Geçerli bir e-posta adresi giriniz.",
            "string.required": "E-posta alanı zorunludur."
        }),
        password: joi.string().empty().min(8).regex(passwordComplexity).required().messages({
            "string.base": "Şifre alanı metinsel (string) bir değer olmak zorunda.",
            "string.empty": "Şifre alanı boş bırakılamaz.",
            "string.min": "Şifre en az 8 karakter içermelidir.",
            "string.pattern.base": "Şifre en az bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter içermelidir.",
            "string.required": "Şifre alanı zorunludur."
        }),
    });
    return schema.validate(data, {abortEarly: false})
}
const user = mongoose.model('User', userSchema)
module.exports = {user, validateUser}
