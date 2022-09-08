const express = require("express");
const connectToMongo = require("./db");
const cors = require("cors");

connectToMongo();
const app = express();
app.use(cors());
const port = 5000;

app.use(express.json());

//Available routes :
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(port, () =>
  console.log(`server listening at http://localhost:${port}`)
);
