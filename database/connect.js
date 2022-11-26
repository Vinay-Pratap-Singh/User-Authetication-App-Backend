const mongoose = require("mongoose");
const db = process.env.MONGO_URL;

try {
  mongoose.connect(db, (error) => {
    if (error) {
      console.log("Database Connection Failed");
    } else {
      console.log("Database Connected Succesfully");
    }
  });
} catch (error) {
  console.log(error);
}
