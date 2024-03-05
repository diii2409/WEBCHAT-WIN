const mongoose = require("mongoose");
const Schema = mongoose.Schema;

async function connect() {
  try {
    await mongoose
      .connect(
        'mongodb://localhost:27017/webchat-win', {
          useNewUrlParser: true,
          useUnifiedTopology: true,
      })
      .then(() => console.log("connection established"));
  } catch (error) {
    console.log("connection error: " + error);
  }
}
module.exports = { connect };
