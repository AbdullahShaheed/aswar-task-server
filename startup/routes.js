const express = require("express");
const products = require("../routes/products");
const users = require("../routes/users");
const logins = require("../routes/logins");

module.exports = function (app) {
  app.use(express.json());
  app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    next();
  });
  app.use("/api/products", products);
  app.use("/api/users", users);
  app.use("/api/logins", logins);
};
