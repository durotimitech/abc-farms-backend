// Required Packages
require("dotenv").config();
const http = require("http");
const app = require("./app");

// PORT variable
const port = process.env.PORT || 5000;

// Create the server
const server = http.createServer(app);

// Always listen to the port
server.listen(port, () => console.log(`Server started on PORT ${port}`));
