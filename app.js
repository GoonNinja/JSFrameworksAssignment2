var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

//Connection
var indexRouter = require("./routes/index");
var jobsRouter = require("./routes/jobs");
//Database connectivity
var mongoose = require("mongoose");
var globals = require("./config/globals");
//import HBS package to add helper functions
var hbs = require("hbs");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/jobs", jobsRouter);

//Connect to MongoDB
mongoose
  .connect(
    globals.ConnectionString.MongoDB
  )
  .then(() => {
    console.log("Successful Connection");
  })
  .catch((err) => {
    console.log(err);
  });

//Register custom helper to change date formatting
hbs.registerHelper("toShortDate", (longDateValue) => {
  return new hbs.SafeString(longDateValue.toLocaleDateString("en-CA"));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
