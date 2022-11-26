const mongoose = require("mongoose");
const user = require("../model/usermodel");

// function for adding the new user to database
exports.createUser = async (req, res) => {
  // try catch to handle the error
  try {
    const { name, number, email, password, cpassword } = await req.body;

    // checking the fields are empty or not
    if (!name || !number || !email || !password || !cpassword) {
      res.status(400).json({
        status: false,
        message: "All fields are compulsory",
      });
    }

    // checking that the password and cpassword is same or not
    if (password !== cpassword) {
      res.status(400).json({
        status: false,
        message: "Both password should be same",
      });
    }

    // checking that the email is already registered or not
    const checkEmail = await user.find({ email });
    if (checkEmail) {
      res.status(400).json({
        status: false,
        message: "Email already exists",
      });
    }

    // adding the user to database if email not exists
    else {
      const newUser = new user({ name, number, email, password });
      const saveUser = await newUser.save();

      // if account details saved
      if (saveUser) {
        res.status(200).json({
          status: true,
          message: "Account created succesfully",
        });
      }

      // if account details not saved
      else {
        res.status(500).json({
          status: false,
          message: "Failed to create account",
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Failed to create account",
      error,
    });
  }
};
