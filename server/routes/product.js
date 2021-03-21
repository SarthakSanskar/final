const express = require('express');

const router = express.Router();

//middlewares
const {adminCheckCreateP ,adminCheckDeleteP, adminCheckUpdateP , authCheck} = require('../middlewares/auth');


//controllers
const { create ,listAll ,remove, read, update , list ,  productsCount, productStar, listRelated , searchFilters} = require('../controllers/product');


router.post('/product', adminCheckCreateP , create);
router.get('/products/total' , productsCount);
router.get('/products/:count', listAll);
router.get('/product/:slug' , read);
router.put('/product/:slug',  adminCheckUpdateP ,  update);
router.delete('/product/:slug', adminCheckDeleteP , remove);
router.post('/products' , list);
//rating
router.put('/product/star/:productId' , authCheck, productStar );
//related
router.get('/product/related/:productId' , listRelated);
//search
router.post('/search/filters' , searchFilters)


module.exports = router;
