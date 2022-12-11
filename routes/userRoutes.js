const express = require("express");
const { createUser, login, dashboard } = require("../controller/userController");
const { auth } = require("../middleware/auth");
const router = express.Router();

router.get("/",auth,dashboard)
router.post("/register", createUser);
router.post("/login", login);

module.exports = router;