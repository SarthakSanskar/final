const User = require('../models/user');
const admin = require('../firebase');
exports.createOrUpdateUser = async (req, res) => {

  // try {
    // const {email} = req.user;
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", req, "@@@@@@@@@@@@@@@@@@@@@@@@@");
    //
    // const user = await User.findOneAndUpdate({email: email}, {name: email.split('@')[0], picture}, {new:true})
    const firebaseUser = await admin.auth().verifyIdToken(req.body.authtoken);
    console.log('<<<<<<<<FIREBASE USER IN AUTHCHECK Middleware>>>>>>>>', firebaseUser);
    const { name, picture, email } = firebaseUser;

    console.log(email)

    if (req.user) {
      console.log("<<<<<<<<<<User Updated >>>>>>>>>>>>");
      // res.setHeader(user);
      // res.json(user);
      // console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@ auth controller done @@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
      // res.send(user);
      // res.status(200);
      // res.json(user);
      // res.status(200).end();
      // console.log("~~~~~~~~~~~~~~~~~~~~Succesfully completed~~~~~~~~~~~~~~~~~~~~~~~~~~");
    } else {
      const newUser = await User({
        email: email,
        name: email.split('@')[0],
        //  picture,
      });
      newUser.save();
      console.log("<<<<<<<User CREATED>>>>>>>>>>", newUser);
      // res.send(newUser);
    }
  // } catch (err) { console.log("!!!!!!!!!!!!Error occured from authcontroller!!!!!!!!!!!!!!!!!!!!!!!!", err) }

};


exports.currentUser = async (req, res) => {
  console.log("!!!!!!!!!!!!!!!!Succesfully Current user worked");

}


exports.currentAdmin = async (req, res) => {
  console.log("!!!!!!!!!!!!!!!!Succesfully Current ADMIN worked");
}
