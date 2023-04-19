const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../model/User.model");
const blacklist = [];

router.get("/", (req, res) => res.send("Hello World"));

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const user = new User({ name, email, password });
  //   console.log(user)
  await user.save();
  return res.status(201).send("User created");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (user) {
      if (email === user.email && password === user.password) {
        const token = jwt.sign({ id: user._id, name: user.name }, "SECRET", {
          expiresIn: "7 days",
        }); //payload(id,name) and signature(SECRET)(which wiil be used by server to generate token)
        const refreshToken = jwt.sign({ id: user._id }, "REFRESHSECRET", {
          expiresIn: "28 days",
        });
        return res.send({
          msg: "Login success",
          token: token,
          refreshToken: refreshToken,
        });
      }
    }
  } catch (error) {
    return res.status(401).send("Invalid credentails");
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const token = req.headers["authorization"];
  if (!token) {
    return res.send("Unauthorization");
  }
  if (blacklist.includes(token)) {
    return res.send("token already expired");
  }
  try {
    const verification = jwt.verify(token, "SECRET");
    if (verification) {
      const user = await User.findById({ _id: id });
      return res.send(user);
    }
  } catch (error) {
    if (error.message === "jwt expired") {
      blacklist.push(token);
    }
    return res.send("Invalid token");
  }
});

//refresh Token
router.post("/refresh", async (req, res) => {
  const refreshToken = req.headers["authorization"];
  if (!refreshToken) {
    return res.status(401).send("unauthorized");
  }
  try {
    const verification = jwt.verify(refreshToken, "REFRESHSECRET");
    if (verification) {
      const userData = await User.findOne({ _id: verification.id });
      const newToken = jwt.sign({ ...userData }, "SECRET", {
        expiresIn: "7 days",
      });
      return res.send({ token: newToken });
    }
  } catch (error) {
    //refresh token is expired, redirect user to login page
    console.log(error.message);
    return res.send("refresh token is expired login again");
  }
});

//logout
router.post("/logout", (req, res) => {
  const token = req.headers["authorization"];
  blacklist.push(token);
  return res.send("User logged out successfully");
});

module.exports = router;
