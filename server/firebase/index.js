var admin = require("firebase-admin");

var serviceAccount = require("../config/firebaseServiceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://dream-e-rent-default-rtdb.firebaseio.com",
});


module.exports = admin;
