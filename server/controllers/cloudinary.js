const cloudinary = require('cloudinary');



cloudinary.config({
  cloud_name: 'ngmc',
  api_key: '225733522767338',
  api_secret: 'JcBDHBIZOCp0ttueP1bZAcLtnjY',
});

exports.upload = async (req, res) => {
  console.log('########### CLOUDINARY BACKEND UPLOAD COMPLETED');
}



exports.remove = (req, res) => {
  console.log('########### CLOUDINARY BACKEND REMOVE COMPLETED');
}
