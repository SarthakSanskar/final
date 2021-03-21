const express = require('express');

const router = express.Router();

//middlewares
const {authCheck, adminCheck ,authCheckCurr} = require('../middlewares/auth');


//controllers
const {createOrUpdateUser,currentUser ,currentAdmin} = require('../controllers/authController');


router.post('/create', authCheck , createOrUpdateUser);
router.post('/current-user', authCheckCurr , currentUser);
router.post('/current-admin', adminCheck , currentAdmin);

module.exports = router;
