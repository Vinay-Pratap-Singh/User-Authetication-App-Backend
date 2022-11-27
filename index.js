require('dotenv').config()
const express = require("express");
const app = express();
app.use(express.json());
const port = process.env.PORT || 5000;

// connecting the database
require("./database/connect");

// adding the routes
const route = require("./routes/userRoutes");
app.use("/", route);

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
