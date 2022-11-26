require('dotenv').config()
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

// connecting the database
require("./database/connect");

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
