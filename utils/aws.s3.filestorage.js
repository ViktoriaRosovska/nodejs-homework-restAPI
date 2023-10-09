const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs/promises");
const gravatar = require("gravatar");
const { HttpError } = require("../helpers");
const path = require("path");

const fileStorage = async (req, userId) => {
  let avatarURL;
  const { email } = req.body;
  if (req.file) {
    const { path: tempUpload, mimetype } = req.file;
    console.log(tempUpload);
    const tempFile = path.join(tempUpload);
    console.log(tempUpload);
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
  } else {
    avatarURL = gravatar.url(email);
  }
  return avatarURL;
};

module.exports = {
  fileStorage,
};
