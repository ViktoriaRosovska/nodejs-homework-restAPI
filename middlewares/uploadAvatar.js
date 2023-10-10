const multer = require("multer");
const path = require("path");
const { HttpError } = require("../helpers");

const tempDir = path.join(__dirname, "../", "temp");

const multerFilter = (req, file, cbk) => {
  if (file.mimetype.startsWith("image/")) {
    cbk(null, true);
  } else {
    cbk(HttpError(400, "Please, upload image only"), false);
  }
};

const multerConfig = multer.diskStorage({
  destination: tempDir,
  filename: (req, file, cbk) => {
    cbk(null, file.originalname);
  },
  limit: 2 * 1024 * 1024,
});

const upload = multer({
  storage: multerConfig,
  fileFilter: multerFilter,
});

/* upload.array("avatarURL", 8) - можна завантажити в поле avatarURL до 8 файлів одночасно
   upload.single("avatarURL") - можна завантажити в поле avatarURL один файл
   upload.fields([{name: "fieldName", maxCount: "count of files"}, - можна завантажити багато файлів з багатьох полів
                  { name: "fieldName", maxCount: "count of files"},
                  ................................................ ])
*/

module.exports = { upload };
