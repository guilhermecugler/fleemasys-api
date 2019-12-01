const express = require("express");
const routes = require("./routes");

const server = express();

server.use(express.json());

server.use(routes);

server.listen(process.env.PORT || 3001, function() {
  console.log("Server is running");
});
