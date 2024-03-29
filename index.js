const express = require("express");
const connectToMongo = require("./db");
const cors = require("cors");

require("dotenv").config();

const app = express();
app.use(cors());

app.use(express.json());

//Available routes :
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

connectToMongo().then(() => {
  app.listen(process.env.PORT, () =>
    console.log(`server listening at http://localhost:${process.env.PORT}`)
  );
});
