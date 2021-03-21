const Sub = require('../models/SubCategory');
const slugify = require('slugify');
const Product = require('../models/product');

exports.create = async (req, res) => {
  try {
    console.log("$$$$$$$$$$$$$$$ CATEGORY CREATE completed $$$$$$$$$$$$$$");
  } catch (err){
    res.status(400).send('@@@@@Create category failed@@@@@@');
  }

}
exports.list = async (req, res) => {
  res.json(await Sub.find({}).sort({createdAt: -1}).exec());
  console.log("List Send to frontend");
}
exports.read = async (req, res) => {
  let sub = await Sub.findOne({slug: req.params.slug}).exec();
  const products = await Product.find({subs: sub})
  .populate('category')
  // .populate('postedBy', '_id name')
  .exec()
  res.json({
    sub,
    products,
  });
};

exports.update = async (req, res) => {
  try {

  }catch (err) {

  }

}
exports.remove = async (req, res) => {
  try {
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ DONE FROM CATEGORY create Middleware @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");

  }catch (err) {
    res.status(400).send('@@@@@ DELETE category failed@@@@@@');

  }

}
