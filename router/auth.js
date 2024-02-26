const router = require('express').Router();
const {register, login, forgotPassword, changePassword, verifyEmail} = require("../controller/auth");

router.post('/login', login)
router.post('/register', register)
router.post('/forgot-password', forgotPassword)
router.post('/change-password/:id', changePassword)
router.post('/verify-email/:id', verifyEmail)

module.exports = router;
