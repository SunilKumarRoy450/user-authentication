const mongoose = require("mongoose");

const connect = () => {
  return mongoose
    .connect(`mongodb://127.0.0.1:27017/jwt`)
    .then(() => console.log("Connected to Database"))
    .catch((err) => console.log(err));
    //show dbs;
    // use ...;
    //show collections
    //db.users.find()
};

module.exports = connect;

