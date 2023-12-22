const express = require("express");
const { UserModel } = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userRouter = express.Router();

userRouter.get("/", (req, res) => {
  res.send("All the user");
});

userRouter.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hash = await bcrypt.hash(password, 10); // You can adjust the salt rounds

    // Create a new user
    const newUser = new UserModel({ name, email, password: hash });
    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      status: 1,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      status: 0,
      error: error.message,
    });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let option ={
    expiresIn:"1hr"
  }

  try {
    let data = await UserModel.find({ email });
    if (data.length > 0) {
      let token = jwt.sign({ userId: data[0]._id }, "saurabh",option);
      bcrypt.compare(password, data[0].password, function (err, result) {
        if (err)
          return res.send({ message: "Somthing went wrong:" + err, status: 0 });
        if (result) {
          res.send({
            message: "User logged in successfully",
            token: token,
            status: 1,
          });
        } else {
          res.send({
            message: "Incorrect password",
            status: 0,
          });
        }
      });
    } else {
      res.send({
        message: "User does not exist",
        status: 0,
      });
    }
  } catch (error) {
    res.send({
      message: error.message,
      status: 0,
    });
  }
});

module.exports = { userRouter };
