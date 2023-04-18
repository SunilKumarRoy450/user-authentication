const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../model/User.model");

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
  const user = await User.findOne({ email, password });
  if (user) {
    if (email === user.email && password === user.password) {
      const token = jwt.sign({ id: user._id, name: user.name }, "SECRET"); //payload(id,name) and signature(SECRET)(which wiil be used by server to generate token)
      return res.send({ msg: "Login success", token: token });
    }
  }
  return res.status(401).send("Invalid credentails");
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const token = req.headers["authorization"];
  if (!token) {
    return res.send("Unauthorization");
  }
  try {
    const verification = jwt.verify(token, "SECRET");
    if (verification) {
      const user = await User.findById({ _id: id });
      return res.send(user);
    }
  } catch (error) {
    return res.send("Invalid token");
  }
});

module.exports = router;
