const admin = require('../firebase');
const Category = require('../models/category');
const Sub = require('../models/SubCategory');
const User = require('../models/user');
const Product = require('../models/product');
const slugify = require('slugify');
const cloudinary = require('cloudinary');







exports.authCheck = async (req,res,next) => {
  // console.log("@@@@@@@@@@@@@Authtoken@@@@@@@@@@@@@", req.body.authtoken);   //token
  try {
    const firebaseUser = await admin.auth().verifyIdToken(req.body.authtoken);
    console.log('<<<<<<<<FIREBASE USER IN AUTHCHECK Middleware>>>>>>>>', firebaseUser);
    const {name, picture, email} = firebaseUser;
    const user = await User.findOneAndUpdate({email: email}, {name: email.split('@')[0], picture}, {new:true});
    req.user = user;
    console.log("!!!!!!!!!!!!!!!!!!USER!!!!!!!!!!!!!!!!!" ,req.user);
    // res.status(200).send(req.user);
    res.json(user);
    next();
  } catch(err) {
    console.log("$$$$$$$$$$", err);
    res.status(401).json({
      err :"#########Invalid or Expired Token#######",
    });
  }

  next();
};




exports.authCheckCurr = async (req,res,next) => {
  try {
    const firebaseUser = await admin.auth().verifyIdToken(req.body.authtoken);
    // console.log('<<<<<<<<FIREBASE USER IN AUTHCHECK Middleware Curr>>>>>>>>', firebaseUser);
    const {email} = firebaseUser;
    User.findOne({email: email}).exec((err,user) =>{
      if (err) throw new Error(err);
      res.json(user);
      next();
    })
  }catch(err) {
    console.log("$$$$$$$$$$", err);
    res.status(401).json({
      err :"#########Invalid or Expired Token Curr User#######",
    });
  }
  next();
};




exports.adminCheck = async (req, res, next) => {
  try {
        const firebaseUser = await admin.auth().verifyIdToken(req.body.authtoken);
        console.log('<<<<<<<<FIREBASE USER IN AUTHCHECK Middleware ADMIN>>>>>>>>', firebaseUser);
        const {email} = firebaseUser;
        req.user = firebaseUser;
        const adminUser = await User.findOne({email}).exec();

        if(adminUser.role !== 'admin'){
          res.status(403).json({
            err: "Admin resource. Access denied."
          });
        }else {
          next();
        }
      }catch (err) {
        console.log("$$$$$$$$$$ ERROR from ADMINN $$$$$$$$$$$$$", err);
        res.status(401).json({
          err :"#########Admin Check Error#######",
        });
      }
      next();
}




exports.adminCheckImageUpload = async (req, res, next) => {
  try {
        const firebaseUser = await admin.auth().verifyIdToken(req.body.authtoken);
        console.log('<<<<<<<<FIREBASE USER IN AUTHCHECK Middleware ADMIN>>>>>>>>', firebaseUser);
        const {email} = firebaseUser;
        req.user = firebaseUser;
        const adminUser = await User.findOne({email}).exec();
        
        if(adminUser.role !== 'admin'){
          res.status(403).json({
            err: "Admin resource. Access denied."
          });
        }else {
                let result = await cloudinary.uploader.upload(req.body.image, {
                  public_id: `${Date.now()}` , // name to that photo
                  resource_type: 'auto' // jpeg, png...
                });
                // console.log("@@@@@@@@@@@@@@@" , result , "##############")
                res.json({
                  public_id: result.public_id,
                  url: result.secure_url,
                });
                next();
          }

      }catch (err) {
        console.log("$$$$$$$$$$ ERROR from ADMINN $$$$$$$$$$$$$", err);
        res.status(401).json({
          err :"#########Admin Check Error#######",
        });
      }
      next();
}


exports.adminCheckImageRemove = async (req, res, next) => {
  try {
        // console.log(req);
        const firebaseUser = await admin.auth().verifyIdToken(req.body.authtoken);
        console.log('<<<<<<<<FIREBASE USER IN AUTHCHECK Middleware ADMIN>>>>>>>>', firebaseUser);
        const {email} = firebaseUser;
        req.user = firebaseUser;
        const adminUser = await User.findOne({email}).exec();

        if(adminUser.role !== 'admin'){
          res.status(403).json({
            err: "Admin resource. Access denied."
          });
        }else {
                let image_id = req.body.public_id;
                // cloudinary.uploader.destroy(image_id)
                // .then(res.send('DONE@@@@@@@@@@@@@@@@@@@@@@'))
                // .catch((err) => {
                // if (err) console.log('ERROR FROM CLOUDINARY REMOVE',err);
                //   // console.log('result', result);
                //   // res.json({'done'});
                //   // if (err) return res.json({err});
                //   // res.send('ok');
                // });


                cloudinary.uploader
                    .destroy(image_id)
                    .then((result) => {
                      console.log("!!!!!!!!!!!!!!!!!!!!!!!!destroy worked!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                      response.status(200).send({
                        message: "success",
                        result,
                      });
                    })
                    .catch((error) => {
                      response.status(500).send({
                        message: "Failure",
                        error,
                      });
                    });
                next();
          }
      }catch (err) {
        console.log("$$$$$$$$$$ ERROR from ADMINN $$$$$$$$$$$$$", err);
        res.status(401).json({
          err :"#########Admin Check Error#######",
        });
      }
      next();
}





// CREATE
exports.adminCheckCreate = async (req, res, next) => {
  try {
        const firebaseUser = await admin.auth().verifyIdToken(req.body.authtoken);
        console.log('<<<<<<<<FIREBASE USER IN AUTHCHECK Middleware ADMIN>>>>>>>>', firebaseUser);
        const {email} = firebaseUser;
        req.user = firebaseUser;
        const adminUser = await User.findOne({email}).exec();

        if(adminUser.role !== 'admin'){
          res.status(403).json({
            err: "Admin resource. Access denied."
          });
        }else {
          try {
            const {name} = req.body.category;
            const category = await new Category({name, slug: slugify(name).toString() }).save();
            res.json(category);
            console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ DONE FROM CATEGORY create Middleware @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
            next();
          }catch(err){
            res.status(400).send('@@@@@Create category failed@@@@@@');
          }

        }
      }catch (err) {
        console.log("$$$$$$$$$$ ERROR from CATEG_CREATE $$$$$$$$$$$$$", err);
        res.status(401).json({
          err :"#########Admin Check Error#######",
        });
      }
      next();
}


exports.adminCheckSubCreate = async (req, res, next) => {
  try {
        const firebaseUser = await admin.auth().verifyIdToken(req.body.authtoken);
        console.log('<<<<<<<<FIREBASE USER IN AUTHCHECK Middleware ADMIN>>>>>>>>', firebaseUser);
        const {email} = firebaseUser;
        req.user = firebaseUser;
        const adminUser = await User.findOne({email}).exec();

        if(adminUser.role !== 'admin'){
          res.status(403).json({
            err: "Admin resource. Access denied."
          });
        }else {
          try {
            const {name,parent } = req.body.sub;
            const category = await new Sub({name, parent, slug: slugify(name).toString() }).save();
            res.json(category);
            console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ DONE FROM CATEGORY create Middleware @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
            next();
          }catch(err){
            res.status(400).send('@@@@@Create Subcategory failed@@@@@@');
          }

        }
      }catch (err) {
        console.log("$$$$$$$$$$ ERROR from SUB_CATEG_CREATE $$$$$$$$$$$$$", err);
        res.status(401).json({
          err :"#########Admin Check Error#######",
        });
      }
      next();
}




exports.adminCheckCreateP = async (req, res, next) => {
  try {
        console.log(req.body);
        const firebaseUser = await admin.auth().verifyIdToken(req.body.authtoken);
        console.log('<<<<<<<<FIREBASE USER IN AUTHCHECK Middleware ADMIN>>>>>>>>', firebaseUser);
        const {email} = firebaseUser;
        req.user = firebaseUser;
        const adminUser = await User.findOne({email}).exec();

        if(adminUser.role !== 'admin'){
          res.status(403).json({
            err: "Admin resource. Access denied."
          });
        }else {
          try {
            console.log(req.body);
            req.body.product.slug = slugify(req.body.product.title);
            const product = await new Product(req.body.product).save();
            res.json(product);
            console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ DONE FROM Product create Middleware @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
            next();
          }catch(err){
            console.log(err);
            // res.status(400).send('@@@@@Create Product failed@@@@@@');
            res.status(400).json({
              err: err.message,
            });
          }


        }
      }catch (err) {
        console.log("$$$$$$$$$$ ERROR from PROD_CREATE $$$$$$$$$$$$$", err);
        res.status(401).json({
          err :"#########Admin Check Error#######",
        });
      }
      next();
}













// DELETE
exports.adminCheckDelete = async (req, res, next) => {
  try {
        // console.log("token from backend" , req);
        const firebaseUser = await admin.auth().verifyIdToken(req.body.authtoken);
        console.log('<<<<<<<<FIREBASE USER IN AUTHCHECK Middleware ADMIN>>>>>>>>', firebaseUser);
        const {email} = firebaseUser;
        req.user = firebaseUser;
        const adminUser = await User.findOne({email}).exec();

        if(adminUser.role !== 'admin'){
          res.status(403).json({
            err: "Admin resource. Access denied."
          });
        }else {
          let deleted = await Category.findOneAndDelete({slug: req.params.slug}).exec();
          res.json(deleted);
          next();
        }
      }catch (err) {
        console.log("$$$$$$$$$$ ERROR from CATEG_DELETE $$$$$$$$$$$$$", err);
        res.status(401).json({
          err :"#########Admin Check Error#######",
        });
      }
      next();
}





exports.adminCheckDeleteP = async (req, res, next) => {
  try {
        // console.log("token from backend" , req);
        const firebaseUser = await admin.auth().verifyIdToken(req.body.authtoken);
        console.log('<<<<<<<<FIREBASE USER IN AUTHCHECK Middleware ADMIN>>>>>>>>', firebaseUser);
        const {email} = firebaseUser;
        req.user = firebaseUser;
        const adminUser = await User.findOne({email}).exec();

        if(adminUser.role !== 'admin'){
          res.status(403).json({
            err: "Admin resource. Access denied."
          });
        }else {
          try {
            let products = await Product.findOneAndRemove({slug: req.params.slug})
            .exec()
            res.json(products);
            console.log("$$$$$$$$$$$$$$$ PRODUCT REMOVE Middleware $$$$$$$$$$$$$$");
          } catch (err){
            res.status(400).send('@@@@@PRODUCT DELETE failed@@@@@@');
          }
          next();
        }
      }catch (err) {
        console.log("$$$$$$$$$$ ERROR from PROD_DELETE $$$$$$$$$$$$$", err);
        res.status(401).json({
          err :"#########Admin Check Error#######",
        });
      }
      next();
}











exports.adminCheckSubDelete = async (req, res, next) => {
  try {
        // console.log("token from backend" , req);
        const firebaseUser = await admin.auth().verifyIdToken(req.body.authtoken);
        console.log('<<<<<<<<FIREBASE USER IN AUTHCHECK Middleware ADMIN>>>>>>>>', firebaseUser);
        const {email} = firebaseUser;
        req.user = firebaseUser;
        const adminUser = await User.findOne({email}).exec();

        if(adminUser.role !== 'admin'){
          res.status(403).json({
            err: "Admin resource. Access denied."
          });
        }else {
          let deleted = await Sub.findOneAndDelete({slug: req.params.slug}).exec();
          res.json(deleted);
          next();
        }
      }catch (err) {
        console.log("$$$$$$$$$$ ERROR from SUBCATEG_DELETE $$$$$$$$$$$$$", err);
        res.status(401).json({
          err :"#########Admin Check Error#######",
        });
      }
      next();
}











// UPDATE
exports.adminCheckUpdate = async (req, res, next) => {
  try {
        const firebaseUser = await admin.auth().verifyIdToken(req.body.authtoken);
        console.log('<<<<<<<<FIREBASE USER IN AUTHCHECK Middleware ADMIN>>>>>>>>', firebaseUser);
        const {email} = firebaseUser;
        req.user = firebaseUser;
        const adminUser = await User.findOne({email}).exec();

        if(adminUser.role !== 'admin'){
          res.status(403).json({
            err: "Admin resource. Access denied."
          });
        }else {
          console.log('**************************body************************************************',req.body);
          const {name} = req.body.category;
          let updated = await Category.findOneAndUpdate({slug: req.params.slug}, {name, slug: slugify(name)}, {new: true} );
          res.json(updated);
          next();
        }
      }catch (err) {
        console.log("$$$$$$$$$$ ERROR from CATEG_UPDATE $$$$$$$$$$$$$", err);
        res.status(401).json({
          err :"#########Admin Check Error#######",
        });
      }
      next();
}



exports.adminCheckSubUpdate = async (req, res, next) => {
  try {
        const firebaseUser = await admin.auth().verifyIdToken(req.body.authtoken);
        console.log('<<<<<<<<FIREBASE USER IN AUTHCHECK Middleware ADMIN>>>>>>>>', firebaseUser);
        const {email} = firebaseUser;
        req.user = firebaseUser;
        const adminUser = await User.findOne({email}).exec();

        if(adminUser.role !== 'admin'){
          res.status(403).json({
            err: "Admin resource. Access denied."
          });
        }else {
          console.log('**************************body************************************************',req.body);
          const {name,parent} = req.body.sub;
          let updated = await Sub.findOneAndUpdate({slug: req.params.slug}, {name,parent,  slug: slugify(name)}, {new: true} );
          res.json(updated);
          next();
        }
      }catch (err) {
        console.log("$$$$$$$$$$ ERROR from SUBCATEG_UPDATE $$$$$$$$$$$$$", err);
        res.status(401).json({
          err :"#########Admin Check Error#######",
        });
      }
      next();
}

exports.adminCheckUpdateP =  async (req, res, next) => {
  try {
        const firebaseUser = await admin.auth().verifyIdToken(req.body.authtoken);
        console.log('<<<<<<<<FIREBASE USER IN AUTHCHECK Middleware ADMIN>>>>>>>>', firebaseUser);
        const {email} = firebaseUser;
        req.user = firebaseUser;
        const adminUser = await User.findOne({email}).exec();

        if(adminUser.role !== 'admin'){
          res.status(403).json({
            err: "Admin resource. Access denied."
          });
        }else {
          if(req.body.product.title){
            req.body.product.slug =   slugify(req.body.product.title);
          }
      
          const updated = await Product.findOneAndUpdate({ slug: req.params.slug }, req.body.product , {new : true}).exec();
          res.json(updated);
          next();
        }
      }catch (err) {
        console.log('Product Update error' , err)
        // return res.status(400).send('Product Update failed')
        res.status(400).send('@@@@@ Update category failed@@@@@@');
      }
      next();
};


// exports.authCheckForStarRating = async (req,res,next) => {
//   // console.log("@@@@@@@@@@@@@Authtoken@@@@@@@@@@@@@", req.body.authtoken);   //token
//   try {
//     const firebaseUser = await admin.auth().verifyIdToken(req.body.authtoken);
//     console.log('<<<<<<<<FIREBASE USER IN AUTHCHECK Middleware>>>>>>>>', firebaseUser);
//     const {name, picture, email} = firebaseUser;
//     const userr = await User.findOneAndUpdate({email: email}, {name: email.split('@')[0], picture}, {new:true});
//     req.user = userr;
//     console.log("!!!!!!!!!!!!!!!!!!USER!!!!!!!!!!!!!!!!!" ,req.user);
//     // res.status(200).send(req.user);
//     res.json(user);
//     next();
//   } catch(err) {
//     console.log("$$$$$$$$$$", err);
//     res.status(401).json({
//       err :"#########Invalid or Expired Token#######",
//     });
//   }

//   next();
// };

