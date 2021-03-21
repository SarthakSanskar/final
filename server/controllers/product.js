const Product = require('../models/product');
const slugify = require('slugify');
const product = require('../models/product');
const user = require('../models/user');
const User = require('../models/user');
const { aggregate } = require('../models/product');

exports.create = async (req, res) => {
  try {
    // const {name} = req.body;
    // const category = await new Category({name, slug: slugify(name) }).save();
    // res.json(category);
    console.log("$$$$$$$$$$$$$$$ PRODUCT CREATE completed $$$$$$$$$$$$$$");
  } catch (err) {
    res.status(400).send('@@@@@Create category failed@@@@@@');
  }
}


exports.listAll = async (req, res) => {
  try {
    let products = await Product.find({})
      .limit(parseInt(req.params.count))
      .populate('category')
      .populate('subs')
      .sort([['createdAt', 'desc']])
      .exec()
    res.json(products);
    console.log("$$$$$$$$$$$$$$$ PRODUCT CREATE completed $$$$$$$$$$$$$$");
  } catch (err) {
    res.status(400).send('@@@@@Create category failed@@@@@@');
  }
}


exports.remove = async (req, res) => {
  console.log("$$$$$$$$$$$$$$$ PRODUCT REMOVE completed $$$$$$$$$$$$$$");

}


exports.read = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug })
    .populate('category')
    .populate('subs')
    .exec();

  res.json(product);
  console.log("$$$$$$$$$$$$$$$ PRODUCT Retrive completed $$$$$$$$$$$$$$");

}

exports.update = async (req, res) => {
  try {
    // if(req.body.title){
    //   req.body.slug =   slugify(req.body.title);
    // }

    // const updated = await Product.findOneAndUpdate({ slug: req.params.slug }, req.body , {new : true}).exec();
    // res.json(updated);
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@ Product Update sucessefully @@@@@@@@@@@@@@@@@@@@@@@@@")
  } catch (err) {
    // console.log('Product Update error' , err)
    // // return res.status(400).send('Product Update failed')
    // res.status(400).send('@@@@@ Update category failed@@@@@@');
  }
};

// Without Pagination
// exports.list = async (req, res) => {
//   try {
//     // CreatedAt/UpdatedAt , des/asc , 3
//     const { sort, order, limit } = req.body
//     const products = await Product.find({})
//       .populate('category')
//       .populate('subs')
//       .sort([[sort, order]])
//       .limit(limit)
//       .exec();

//     res.json(products);

//   } catch (err) {
//     console.log(err);
//   };
// };

// With Pagination
exports.list = async (req, res) => {
  console.table(req.body);
  try {
    // CreatedAt/UpdatedAt , des/asc , 3
    const { sort, order, page } = req.body
    const currentPage = page || 1
    const perPage = 3
    const products = await Product.find({})
      .skip((currentPage - 1) * perPage)
      .populate('category')
      .populate('subs')
      .sort([[sort, order]])
      .limit(perPage)
      .exec();

    res.json(products);

  } catch (err) {
    console.log(err);
  };
};

exports.productsCount = async (req, res) => {
  let total = await Product.find({}).estimatedDocumentCount().exec();
  res.json(total);
};


exports.productStar = async (req, res) => {
  const product = await Product.findById(req.params.productId).exec();
  const user = await User.findOne({ email: req.user.email }).exec();
  const { star } = req.body;


  let exsistingRatingObject = product.ratings.find((ele) => (ele.postedBy == user._id))
  console.log("##########", exsistingRatingObject, "@@@@@@@@@@@@@@@@@@");
  if (exsistingRatingObject == undefined) {
    let ratingAdded = await Product.findByIdAndUpdate(product._id, {
      $push: { ratings: { star, postedBy: user._id } },
    }, { new: true }).exec();
    console.log('ratingAdded', ratingAdded);
    res.json(ratingAdded);
  } else {
    const ratingUpdated = await Product.updateOne(
      { ratings: { $elemMatch: exsistingRatingObject }, },
      { $set: { 'ratings.$.star': star } }, { new: true }
    ).exec();
    console.log('ratingUpdated', ratingUpdated);
    res.json(ratingUpdated);
    console.log("################# Product Rating Update")
  }
};

exports.listRelated = async (req, res) => {
  const product = await (await Product.findById(req.params.productId)).exec();

  const related = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
  })
    .limit(3)
    .populate('category')
    .populate('subs')
    .populate('postedBy')
    .exec();

  res.json(related);
};

// Search / Filtering
const handleSearchText = async (req, res, searchText) => {
  const products = await Product.find({ $text: { $search: searchText } })
    .populate('category', '_id name')
    .populate('subs', '_id name')
    .populate('postedBy', '_id name')
    .exec();

  res.json(products);
};

const handlePrice = async (req, res, price) => {
  try {
    let products = await Product.find({
      price: {
        $gte: price[0],
        $lte: price[1],
      },
    })
      .populate('category', '_id name')
      .populate('subs', '_id name')
      .populate('postedBy', '_id name')
      .exec();

    res.json(products);
  } catch (err) {
    console.log(err);
  }
};

const handleCategory = async (req, res, category) => {
  try {
    let products = await Product.find({ category })
      .populate('category', '_id name')
      .populate('subs', '_id name')
      .populate('postedBy', '_id name')
      .exec();

    res.json(products);
  } catch (err) {
    console.log(err);
  }
};

const handleStars = (req, res, stars) => {
  Product.aggregate([
    {
      $project: {
        document: "$Root",
        // title: "$title",
        floorAverage: {
          $floor: { $avg: "$ratings.star" }
        },
      },
    },
    { $match: { floorAverage: stars } },
  ])
    .limit(12)
    .exec((err, aggregates) => {
      if (err) console.log('Aggregate Error', err);
      Product.find({ _id: aggregates })
        .populate('category', '_id name')
        .populate('subs', '_id name')
        .populate('postedBy', '_id name')
        .exec((err, products) => {
          if (err) console.log('Product Aggregate Error', err);
          res.json(products);
        });
    });
};


const handleSub = async (req, res, sub) => {
  const products = await Product.find({ subs: sub })
    .populate('category', '_id name')
    .populate('subs', '_id name')
    .populate('postedBy', '_id name')
    .exec();

  res.json(products);
};



exports.searchFilters = async (req, res) => {
  const { searchText, price, category, stars, sub } = req.body

  if (searchText) {
    console.log('searchText', searchText);
    await handleSearchText(req, res, searchText);

  }

  if (price !== undefined) {
    console.log('price', price);
    await handlePrice(req, res, price);
  }

  if (category) {
    console.log('category', category);
    await handleCategory(req, res, category);
  }

  if (stars) {
    console.log('stars', stars);
    await handleStars(req, res, stars)
  }

  if (sub) {
    console.log('sub', sub);
    await handleSub(req, res, sub);
  }
};

