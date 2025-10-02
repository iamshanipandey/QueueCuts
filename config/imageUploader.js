const cloudinary = require("cloudinary").v2

exports.imageUploader = async(file, folder, type) =>{
    const options = {
        folder,
        resource_type : type || "image",
    }

    return await cloudinary.uploader.upload(file.tempFilePath, options);
}