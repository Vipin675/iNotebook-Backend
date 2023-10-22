// getting-started.js
const mongoose = require("mongoose");
require("dotenv").config();

// const mongooseURI = "mongodb://localhost:27017/iNotebook"; // localhost not working !!
// const mongooseURI = "mongodb://127.0.0.1:27017/iNotebook";

main()
  .catch((err) => console.log(err))
  .then(() => {
    console.log("Connected to the datbase successfully");
  });

async function main() {
  await mongoose.connect(`${process.env.DB_MONGOOSE_URI}`);
}

module.exports = main;
