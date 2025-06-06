const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const routes = require("./routes/index")

const app = express();
app.use(morgan("dev"));
app.use(bodyParser.json({ extended: true, limit: "5mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json({ extended: true, limit: "5mb" }));

app.use("/api", routes, (req, res) => {
  res.send(`Server is up and running`);
});

// connecting to database
mongoose
  .connect(process.env.MONGO_DB_URL, {
  })
  .then(() => {
    // pending
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
    //fulfilled
  })
  .catch((err) => {
    console.log(err.message);
  }); //rejected
