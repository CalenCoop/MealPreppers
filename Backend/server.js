const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");
const flash = require("express-flash");
const logger = require("morgan");
const connectDB = require("./config/database");
const cors = require("cors")
const mainRoutes = require("./routes/main");
const postRoutes = require("./routes/posts");
const cookieParser = require('cookie-parser')

// Use .env file in config folder
require("dotenv").config({ path: "./config/.env" });

// Connect To Database
connectDB();

// Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Logging
app.use(logger("dev"));

// Use forms for put / delete
app.use(methodOverride("_method"));


//cookie-parser
app.use(cookieParser())


//cors
const corsOptions = {
  origin: [/^https:\/\/.*\.netlify\.app$/, 'http://localhost:3006'], 
  methods: "GET,POST,PUT,DELETE", 
  credentials: true, 
};

app.use(cors(corsOptions));


// Setup Sessions - stored in MongoDB
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ 
      mongoUrl: process.env.DB_STRING,
      collectionName: 'sessions', 
    })
  })
);


// Use flash messages for errors, info, etc.
app.use(flash());

// Setup Routes For Which The Server Is Listening
app.use("/", mainRoutes);
app.use("/post", postRoutes);

// Server Running
app.listen(process.env.PORT || 2500 , () => {
    console.log("Server is running on https://66ce9f7d0d24d7e3187befc6--mealpreps.netlify.app/");
});
