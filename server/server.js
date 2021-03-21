var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');
var morgan = require('morgan');
const fs = require('fs');
require('dotenv').config();
// var createuser = require('./routes/auth');
// var user = require('./routes/user');
//import routes


// APP SERVER
var app = express();

// DATABASE
mongoose.connect("mongodb+srv://Sarthak:Indore123@cluster0.aahu2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useCreateIndex : true,
  useFindAndModify: true,
})
.then(() => console.log(`DB connected Successfully`))
.catch((error) => {
  console.log(`DB Connection Error i.e ${error}`);
});


mongoose.Promise = global.Promise;

//middlewares
app.use(morgan("dev"));
app.use(bodyParser.json({limit: "10mb"}));
app.use(cors());

// routes Middleware
// app.use('/api',createuser);
// app.use('/api',user);
// app.use('/api',user);
fs.readdirSync('./routes').map((r) =>
      app.use('/api', require('./routes/' + r)));


//PORT SETUP
const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server is running at port ${port}`));
