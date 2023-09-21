const app = require("./app");
const mongoose = require("mongoose");
// const { DB_HOST } = require("../config");

require("dotenv").config();
const { DB_HOST, PORT = 3000 } = process.env;
// console.log(process.env.MONGO_PASS);
console.log(DB_HOST);
mongoose.set("strictQuery", true);

mongoose
  .connect(DB_HOST, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connection successful");
    app.listen(PORT, () => {
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
