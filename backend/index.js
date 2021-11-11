const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");
const pinRoute = require("./routes/pin");
const userRoute = require("./routes/user");

dotenv.config();

//Without below line we cannot use res.json()
app.use(express.json());

//MongoDB connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB connection is success!");
  })
  .catch((err) => {
    console.log(err);
  });

//Routes
app.use("/api/pins", pinRoute);
app.use("/api/users", userRoute);

app.listen(8800, () => {
  console.log("Backend Server started at port 8800");
});
