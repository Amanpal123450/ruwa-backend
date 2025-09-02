const cloudinary = require("cloudinary").v2;

exports.uploadToCloudinary = async (file, folder, height, quality) => {
  if (!file) throw new Error("No file provided");
  const options = { folder, resource_type: "auto" };
  if (height) options.height = height;
  if (quality) options.quality = quality;

  return await cloudinary.uploader.upload(file.tempFilePath, options);
};
