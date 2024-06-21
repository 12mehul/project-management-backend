const stream = require("stream");
const cloudinary = require("../config/cloudinaryConfig");

const uploadToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const bufferStream = new stream.PassThrough();
    bufferStream.end(fileBuffer);

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: folder },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );

    bufferStream.pipe(uploadStream);
  });
};

module.exports = uploadToCloudinary;
