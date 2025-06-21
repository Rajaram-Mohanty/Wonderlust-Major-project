const cloudinary = require("cloudinary").v2;
const {CloudinaryStorage} = require("multer-storage-cloudinary");

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_DEV',
      allowedFormats: ["png", "jpg", "jpeg"],
    },
  });

  module.exports = {cloudinary, storage};

  //flow of storing a file in cloudinary storage
//   Form(file) using form as enctype="multipart/form-data" --> backend(parse) using multer --> cloud(store) using cloudinary --> url/link(file) --> mongodb(cloudinary file link) to diplay through ejs file