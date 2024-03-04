const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {validateUser, user} = require("../models/user");
const {forgot_password} = require("../models/forgat-password");
const emailService = require("../helpers/mail");
const env = require("dotenv")
const uuid = require('uuid')
const {StatusCodes} = require('http-status-codes');
env.config()

exports.register = (async (req, res) => {
    try {
        const {error} = validateUser(req.body);

        if (error) {
            return res.status(400).json({message: error.message, success: false});
        }
        const {email, password, firstName, lastName, role, isActive} = req.body;

        if (await user.findOne({email})) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: 'Böyle bir mail adresi kullanılmaktadır.',
                success: false,
                status: StatusCodes.NOT_FOUND
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new user({email, password: hashedPassword, firstName, lastName, role, isActive});
        const data = await newUser.save();
        let url = process.env.FRONTEND_URL + `/auth/verify-email/${data._id}`
        emailService.sendMail({
            to: newUser.email, subject: "Hesabınız Oluşturuldu", html: ` <p>Merhaba,</p>
                    <p>Hesabınız başarıyla oluşturuldu.</p>
                    <p>Bilgileriniz:</p>
                    <ul>
                    <li><strong>Kullanıcı Adı:</strong> ${newUser.firstName} ${newUser.lastName}</li>
                    <li><strong>E-posta Adresi:</strong> ${newUser.email}</li>
                    <li><strong>Hesabınızı aktif etmek için linke</strong> <a href="${url}">tıklayın</a></li>
                    </ul>
                    <p>Hesabınıza erişmek için aşağıdaki bağlantıyı kullanabilirsiniz:</p>
                    <p>Eğer hesabınızı siz oluşturmadıysanız, lütfen bu e-postayı dikkate almayınız.</p>
            `,
        });
        return res.status(StatusCodes.OK).json({
            data,
            success: true,
            message: "Kullanıcı başarıyla oluşturuldu",
            status: StatusCodes.OK
        });
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Kullanıcı oluşturulurken beklenmedik bir hata oluştu",
            success: false,
            status: StatusCodes.NOT_FOUND
        });
    }
})

exports.login = (async (req, res) => {
    const {email, password} = req.body;
    const userData = await user.findOne({email});

    if (!userData) {
        return res.status(StatusCodes.NOT_FOUND).json({
            message: 'Böyle bir kullanıcı bulunamadı',
            success: false,
            status: StatusCodes.NOT_FOUND
        });
    }

    if (!(await bcrypt.compare(password, userData.password))) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: 'Authentication failed',
            success: false,
            status: StatusCodes.UNAUTHORIZED
        });
    }

    const token = await this.createToken(userData._id)
    res.status(StatusCodes.OK).json({
        token,
        email: userData.email,
        firstName: userData.firstName,
        isActive: userData.isActive,
        role: userData.role,
        id: userData.id,
        success: true,
        status: StatusCodes.OK,
        message: 'Oturum başarıyla açıldı.',
    });
})

exports.forgotPassword = (async (req, res) => {
    try {
        const {email} = req.body;
        const userData = await user.findOne({email});
        if (!userData) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: 'Böyle bir kullanıcı bulunamadı',
                success: false,
                status: StatusCodes.NOT_FOUND
            });
        }
        let response = await saveForgotPassword(userData)
        let url = process.env.FRONTEND_URL + `/auth/change-password/${response.verification}`
        emailService.sendMail({
            to: response.email, subject: "Şifre Sıfırlama Talebi", html: `<p>Merhaba,</p>
                   <p>Şifrenizi sıfırlamak için lütfen aşağıdaki bağlantıya tıklayın:</p>
                   <p><a href="${url}" target="_blank">Şifreyi Sıfırla</a></p>
                   <p>${url}</p>
                   <p>Eğer bu e-postayı istemediyseniz güvenle yok sayabilirsiniz.</p>`,
        });
        res.status(StatusCodes.OK).json({
            message: 'Şifre sıfırlama maili gönderildi',
            success: true,
            status: StatusCodes.OK
        });
    } catch (e) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Şifre sıfırlama maili gönderilirken bir hata oluştu',
            success: false,
            status: StatusCodes.BAD_REQUEST
        });
    }

})

exports.changePassword = (async (req, res) => {
    try {
        const id = req.params.id

        const verification = await forgot_password.findOne({verification: id});

        if (!verification) {
            return res.status(StatusCodes.NOT_FOUND).json({error: 'Böyle bir talep bulunamadı ya da süresi doldu.'});
        }

        let userData = await user.findOne({email: verification.email});

        if (!userData) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: 'Böyle bir kullanıcı bulunamadı',
                success: false,
                status: StatusCodes.NOT_FOUND
            });
        }


        await user.findByIdAndUpdate(userData._id, {
            $set: {
                password: req.body.password,
            }
        }).then(async () => {
            await forgot_password.deleteOne({verification: req.params.id})
        })


        res.status(StatusCodes.OK).json({
            success: true, status: StatusCodes.OK, message: "Şifreniz başarıyla güncellendi."
        });

    } catch (e) {
        res.status(StatusCodes.BAD_REQUEST).json({
            message: 'Şifre güncellenirken teknik bir hata oluştu.',
            success: false,
            status: StatusCodes.BAD_REQUEST
        });
    }
})

exports.verifyEmail = (async (req, res) => {
    try {
        const {isActive} = req.body
        const id = req.params.id
        const userData = await user.findOne({_id: id});
        if (!userData) {
            return res.status(StatusCodes.NOT_FOUND).json({error: 'Böyle bir kullanıcı bulunamadı'});
        }

        if (isActive) {
            await user.findByIdAndUpdate(userData._id, {
                $set: {
                    isActive,
                }
            }).then(async () => {
                res.status(StatusCodes.OK).json({
                    success: true, status: StatusCodes.OK, message: "Mail doğrulaması başarıyla yapıldı."
                });
            })
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({
                success: false, status: StatusCodes.BAD_REQUEST, message: "Mail doğrulama işlemi başarısız oldu."
            });
        }

    } catch (e) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false, status: StatusCodes.BAD_REQUEST, message: "Mail doğrulama işlemi sırasında bir hata oluştu"
        });
    }

})

exports.createToken = ((id) => {
    return jwt.sign({userId: id}, process.env.JTW_SECRET, {expiresIn: '1h'});
})
let saveForgotPassword = async (data) => {
    const forgotPassword = await forgot_password.create({
        email: data.email, verification: uuid.v4()
    });
    await forgotPassword.save();
    return forgotPassword;
}
