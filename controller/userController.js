const user = require("../model/usermodel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// function for creating the new account
exports.createUser = async (req, res) => {
  const { name, number, email, password, cpassword } = req.body;

  // checking that all the filed are there or not
  if (!name || !number || !email || !password || !cpassword) {
    return res.status(400).json({
      success: false,
      message: "All fields are mandatory",
    });
  }

  // checking that the both password is same or not
  if (password !== cpassword) {
    return res.status(400).json({
      success: false,
      message: "Both password should be same",
    });
  }

  // checking that the user is already in the database or not
  let findUser;
  try {
    findUser = await user.findOne({ email });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Failed to check user",
      error,
    });
  }

  // if user exist
  if (findUser) {
    return res.status(400).json({
      success: false,
      message: "Email already exsit",
    });
  }

  try {
    // hashing the password before saving it
    const hashedPassword = bcrypt.hashSync(password, 12);

    // creating the new user
    const newUser = new user({
      name: name,
      number: number,
      email: email,
      password: hashedPassword,
    });

    // saving the created user
    await newUser.save((err, result) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: "Failed to save the new user",
        });
      }

      if (result) {
        newUser.password = undefined;

        return res.status(200).json({
          success: true,
          message: "New user created",
          data: newUser,
        });
      }
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Failed to save the new user",
      error,
    });
  }
};
