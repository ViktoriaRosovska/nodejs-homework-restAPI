const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs/promises");

const { HttpError } = require("../helpers");
const path = require("path");

const fileStorage = async (req, userId) => {
  let avatarURL;

  if (req.file) {
    const { path: tempUpload, mimetype } = req.file;
    const tempFile = path.join(tempUpload);
    const file = await fs.readFile(tempFile);

    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: `avatar/${userId}.jpg`,
      Body: file,
      ContentType: mimetype,
    };
    const cmd = new PutObjectCommand(params);

    try {
      const s3 = new S3Client();
      const resp = await s3.send(cmd);
      console.log(resp);
      avatarURL = `https://v.sund.uk/` + params.Key;
    } catch (error) {
      console.error(error);

      throw HttpError(500, "Error uploading file to S3. " + error);
    }
  }
  return avatarURL;
};

module.exports = {
  fileStorage,
};
