const Jimp = require("jimp");

const resizeImage = async (sourcePath, destinationPath) => {
  const image = await Jimp.read(sourcePath);
  image.resize(200, 200);
  await image.write(destinationPath);
};

module.exports = {
  resizeImage,
};
