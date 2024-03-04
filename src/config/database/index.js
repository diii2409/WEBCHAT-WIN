const mongoose = require("mongoose");
const Schema = mongoose.Schema;

async function connect() {
  try {
    mongoose
      .connect(
        // URL to connect .
        //NOTE : USE atlas mongoBD
        "",
        // *******88888*******
      )
      .then(() => console.log("connection established"));
  } catch (error) {
    console.log("connection error: " + error);
  }
}
module.exports = { connect };
