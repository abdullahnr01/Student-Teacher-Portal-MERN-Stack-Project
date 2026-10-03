const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./Database/db");
const PORT = 9090;
require("dotenv").config(); // Load env variables globally

// route f
const UserRoute = require("./Routes/user_route");
const StudentRoute = require("./Routes/student_route");
const StudentInfoRoute = require("./Routes/student_info_route");

// db
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/user", UserRoute);
app.use("/student", StudentRoute);
app.use("/studentInfo", StudentInfoRoute);

// Server
app.listen(PORT, () => {
  console.log("Server is listing on port no", PORT);
});
