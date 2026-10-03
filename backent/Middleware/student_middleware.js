const Student = require("../Model/student_model");
const jwt = require("jsonwebtoken");

const SignUp_middleware = async (req, res, next) => {
  try {
    const { name, email, degree, date_of_birth } = req.body;
    let errors = [];

    if (!name || name.trim() === "") {
      errors.push("Name is Required - ");
    }
    if (!degree || degree.trim() === "") {
      errors.push("Degree is Required - ");
    }
    if (!email || email.trim() === "") {
      errors.push("Email is Required - ");
    }
    if (!date_of_birth || date_of_birth.trim() === "") {
      errors.push("Date of Birth is Required");
    }

    if (errors.length > 0) {
      return res.status(400).json({ message: errors });
    }

    const Student_exist = await Student.findOne({ email });
    if (Student_exist) {
      return res
        .status(409)
        .json({ message: "Student already exist this email" });
    }
    next();
  } catch (err) {
    console.error(`Signup Error: ${err}`);
    return res.status(500).json({ message: "Internal Server error." });
  }
};

const delete_middleware = async (req, res, next) => {
  try {
    const { StudentId } = req.query;
    if (!StudentId) {
      return res.status(400).json({ message: "Student Id not found" });
    }
    next();
  } catch (err) {
    console.error(`Deleting data error ${err}`);
    return res.status(500).json({ message: "Internal Server error." });
  }
};

const patch_data_middleware = async (req, res, next) => {
  try {
    const { name, email, degree, date_of_birth, _id } = req.body;

    let errors = [];

    if (!name || name.trim() === "") {
      errors.push("Name is Required - ");
    }
    if (!degree || degree.trim() === "") {
      errors.push("Degree is Required - ");
    }
    if (!email || email.trim() === "") {
      errors.push("Email is Required - ");
    }
    if (!date_of_birth || date_of_birth.trim() === "") {
      errors.push("Date of Birth is Required");
    }

    if (errors.length > 0) {
      return res.status(400).json({ message: errors });
    }

    if (!_id) {
      return res.status(400).json({ message: "User Id is required" });
    }

    next();
  } catch (err) {
    console.error("Updating data error:", err);
    return res.status(500).json({ message: "Internal Server error." });
  }
};

const Sendemail_middlewale = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

 
    next();
  } catch (err) {
    console.error(`Send email error ${err}`);
    return res.status(500).json({ message: "Internal Server error." });
  }
};

const student_login_middleware = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    let errors = [];

    if (!email || email.trim === "") {
      errors.push("Email is Required - ");
    }
    if (!password || password.trim === "") {
      errors.push("Password is Required - ");
    }

    if (errors.length > 0) {
      return res.status(400).json({ message: errors });
    }

    const user = await Student.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Wrong email." });
    }

    next();
  } catch (err) {
    console.error(`Login Student middleware Error: ${err}`);
    return res.status(500).json({ message: "Internal Server error." });
  }
};

const auth_middleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        message: "You are not logged in. Please login to access this resource.",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        message: "Invalid access. Please login again.",
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const { id } = decoded;
    req.teacherId = id;
    next();
  } catch (err) {
    console.error(`Authentication error ${err}`);
    return res.status(401).json({
      message: "Session expired or invalid. Please login again.",
    });
  }
};

module.exports = {
  SignUp_middleware,
  patch_data_middleware,
  delete_middleware,
  student_login_middleware,
  Sendemail_middlewale,
  auth_middleware,
};
