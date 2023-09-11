const express = require("express"),
  bodyParse = require("body-parser"),
  json = express.json({ type: "*/json" }),
  cors = require("cors"),
  { resolve } = require("path");

const app = express();

app.use(json);
app.use(bodyParse.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static(resolve(__dirname, "../../upload")));

module.exports = app;
