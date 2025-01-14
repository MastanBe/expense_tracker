const express = require('express');
const { registerUser, loginUser, recoverPassword } = require('../controllers/userController');

const router = express.Router();


router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/recover', recoverPassword);

module.exports = router;
