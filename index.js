const express = require("express");
const connectToMongo = require("./db");

connectToMongo();
const app = express();
const port = 3000;

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () =>
  console.log(`server listening at http://localhost:${port}`)
);