const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const cookies = require("cookie-parser");
const app = express();

//middleware
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookies());
app.use(authRoutes);

//view engine
app.set("view engine", "ejs");

// database connection
const dbURI = "mongodb+srv://bgn:admin@backenddb.eu4l9xy.mongodb.net/node-auth";
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("\n------------------------------------");
    console.log("Connected to database successfully!");
    app.listen(3000, () => {
      console.log("Server started at port : 3000");
      console.log("------------------------------------");
    });
  })
  .catch((err) => console.log(err));

// routes
app.get("/", (req, res) => res.render("home"));
app.get("/smoothies", (req, res) => res.render("smoothies"));
