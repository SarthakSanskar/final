const express = require('express');

const router = express.Router();


const {adminCheckImageRemove, adminCheckImageUpload} = require('../middlewares/auth');

const {upload, remove} = require('../controllers/cloudinary');


router.post('/uploadimages', adminCheckImageUpload, upload);
router.post('/removeimage', adminCheckImageRemove, remove);

module.exports = router;
