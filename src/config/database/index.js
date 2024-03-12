const mongoose = require("mongoose");
const Schema = mongoose.Schema;

async function connect() {
  try {
    await mongoose
      .connect(
        'mongodb+srv://dongho:dongho@cluster0.bjjftqg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
          useNewUrlParser: true,
          useUnifiedTopology: true,
      })
      .then(() => console.log("connection established"));
  } catch (error) {
    console.log("connection error: " + error);
  }
}
module.exports = { connect };
