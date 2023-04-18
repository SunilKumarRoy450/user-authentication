const express = require("express");
const cors = require("cors");
const PORT = 8080;
const userRouter = require("./controller/user.controller");
const connectDB = require("./config/db");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/users", userRouter);

app.listen(PORT, async () => {
  try {
    console.log(`Server is running on port ${PORT}`);
    await connectDB();
  } catch (error) {
    console.log({ msg: "Something error in connection", error });
  }
});
