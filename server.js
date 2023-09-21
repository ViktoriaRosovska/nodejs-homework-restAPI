const app = require("./app");
const mongoose = require("mongoose");
// const { DB_HOST } = require("../config");
const { DB_HOST, PORT = 3000 } = process.env;
require("dotenv").config();

// console.log(process.env.MONGO_PASS);

mongoose.set("strictQuery", true);

mongoose
  .connect(DB_HOST)
  .then(() => {
    console.log("Database connecter success");
    app.listen(PORT, () => {
      console.log("Server running. Use our API on port: 3000");
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
