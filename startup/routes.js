const express = require("express");
const products = require("../routes/products");
const users = require("../routes/users");
const logins = require("../routes/logins");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/products", products);
  app.use("/api/users", users);
  app.use("/api/logins", logins);
};
