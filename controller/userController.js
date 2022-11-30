const user = require("../model/usermodel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// creating the new user account
exports.createUser = async (req, res) => {
  // try catch to handle the error
  try {
    const { name, number, email, password, cpassword } = await req.body;

    // checking the fields are empty or not
    if (!name || !number || !email || !password || !cpassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are compulsory",
      });
    }

    // checking that the password and cpassword is same or not
    if (password !== cpassword) {
      return res.status(400).json({
        success: false,
        message: "Both password should be same",
      });
    }

    // checking that the email is already registered or not
    const checkEmail = await user.findOne({ email: email.toLowerCase() });
    
    
    if (checkEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // adding the user to database if email not exists
    else {
      // encrypting the password before saving
      const encryptedPass = await bcrypt.hash(password, 12);

      const newUser = new user({
        name,
        number,
        email: email.toLowerCase(),
        password: encryptedPass,
      });
      const saveUser = await newUser.save();

      // if account details saved
      if (saveUser) {
        res.status(200).json({
          success: true,
          message: "Account created succesfully",
        });
      }

      // if account details not saved
      else {
        return res.status(500).json({
          success: false,
          message: "Failed to create account",
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create account",
      error,
    });
  }
};

// creating the login route
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  // checking that the email exits or not
  const checkUser = await user.findOne({ email: email.toLowerCase() });

  if (checkUser) {
    // checking the password is matching or not
    const passwordMatched = await bcrypt.compare(password, checkUser.password);
    if (passwordMatched) {     
        // generating the token
        const token = await jwt.sign(
          { id: checkUser._id, email: email.toLowerCase() },
          process.env.TOKEN_KEY,
          { expiresIn: "6h" }
        );

        // saving the token inside the user details
        checkUser.token = token;
        await checkUser.save();      

      return res.status(200).json({
        success: true,
        message: "User login succesfully",
        token: checkUser.token
      })
    }
    else {
      return res.status(400).json({
        success: false,
        message:"Incorrect details"
      })
    }
  } else {
    return res.status(400).json({
      success: false,
      message: "User not found",
    });
  }
};
