const mongoose = require("mongoose");
require("dotenv").config();

const DB_HOST = `mongodb+srv://torimeister:${process.env.MONGO_PASS}@contactsdb.7i36h7w.mongodb.net/ContactsDB?retryWrites=true&w=majority`;
// console.log(process.env.MONGO_PASS);

mongoose.set("strictQuery", true);
module.exports = { mongoose, DB_HOST };
