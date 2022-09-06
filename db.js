// getting-started.js
const mongoose = require("mongoose");

const mongooseURI = "mongodb://localhost:27017/iNotebook";

main()
  .catch((err) => console.log(err))
  .then(() => {
    console.log("Connected to the datbase successfully");
  });

async function main() {
  await mongoose.connect(`${mongooseURI}`);
}

module.exports = main;
