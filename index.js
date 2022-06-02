const express = require("express");
const app = express();

//if we got unhandled exception, exit the process to start with clean state
process.on("uncaughtException", (ex) => {
  console.log("WE GOT UNCAUGHT EXCEPTION.", ex.message);
  process.exit(1);
});

//db
require("./startup/db")();

//server
const port = process.env.PORT || 3900;
app.listen(port, () => {
  console.log(`Listening to port ${port}...`);
});

//routes
require("./startup/routes")(app);
