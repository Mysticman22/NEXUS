const express = require('express');
const router = express.Router();
const { requestSignupOtp, verifyAndCreateUser } = require('../controllers/authController');

router.post('/request-otp', requestSignupOtp);
router.post('/verify-otp', verifyAndCreateUser);

module.exports = router;