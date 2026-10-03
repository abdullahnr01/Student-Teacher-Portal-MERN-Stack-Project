const mongoose = require("mongoose");

const mongoURI = "mongodb://127.0.0.1:27017/University_Form";

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error", err);
  }
};

module.exports = connectDB;
