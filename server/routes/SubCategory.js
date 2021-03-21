const express = require('express');

const router = express.Router();

//middlewares
const {authCheck, adminCheckSubUpdate, adminCheckSubDelete ,adminCheckSubCreate ,authCheckCurr} = require('../middlewares/auth');


//controllers
const {
       create,
       read,
       update,
       remove,
       list
     } = require('../controllers/sub');


router.post('/sub' ,adminCheckSubCreate , create);
router.get('/subs', list);
router.get('/sub/:slug' , read);
router.put('/sub/:slug',  adminCheckSubUpdate , update);
router.delete('/sub/:slug', adminCheckSubDelete , remove);

module.exports = router;
