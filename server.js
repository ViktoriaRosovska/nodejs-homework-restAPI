const app = require("./app");
const { mongoose, DB_HOST } = require("./mongodb/mongoose");

mongoose
  .connect(DB_HOST)
  .then(() => {
    console.log("Database connecter success");
    app.listen(3000, () => {
      console.log("Server running. Use our API on port: 3000");
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
