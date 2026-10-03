const StudentInfo = require("../Model/student_info_model");
// const StudentSecretKey = process.env.StdSecretKey
const jwt = require("jsonwebtoken");

const Info_Post_middleware = async (req, res, next) => {
  try {
    const { room_no, subject, grade, attendance } = req.body;

    let errors = [];

    if (!room_no || room_no.trim() === "") {
      errors.push("Room is Required - ");
    }
    if (!subject || subject.trim() === "") {
      errors.push("Subject is Required - ");
    }
    if (!grade || grade.trim() === "") {
      errors.push("Grade is Required - ");
    }
    if (!attendance || attendance.trim() === "") {
      errors.push("Attendence is Required");
    }

    if (errors.length > 0) {
      return res.status(400).json({ message: errors });
    }
    next();
  } catch (err) {
    console.error(`Info Post Middleware Error: ${err}`);
    return res.status(500).json({ message: "Internal Server error." });
  }
};

const Info_delete_middleware = async (req, res, next) => {
  try {
    const { StudentInfo_Id } = req.query;
    if (!StudentInfo_Id) {
      return res.status(400).json({ message: "Info id not found" });
    }
    next();
  } catch (err) {
    console.error(`Info Deleting error ${err}`);
    return res.status(500).json({ message: "Internal Server error." });
  }
};

const Info_update_middleware = async (req, res, next) => {
  try {
    const { room_no, subject, grade, attendance, _id } = req.body;

    let errors = [];

    if (!room_no || room_no.trim() === "") {
      errors.push("Room is Required - ");
    }
    if (!subject || subject.trim() === "") {
      errors.push("Subject is Required - ");
    }
    if (!grade || grade.trim() === "") {
      errors.push("Grade is Required - ");
    }
    if (!attendance || attendance === "") {
      errors.push("Attendence is Required");
    }

    if (errors.length > 0) {
      return res.status(400).json({ message: errors });
    }

    if (!_id) {
      return res.status(400).json({ message: "Info Id not found" });
    }
    next();
  } catch (err) {
    console.error(`Info update Middleware Error: ${err}`);
    return res.status(500).json({ message: "Internal Server error midd." });
  }
};

const info_auth_middleware =  async (req ,  res , next) => {
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

    const decoded = jwt.verify(token,process.env.StdSecretKey);
    const { id } = decoded;
    req.student_id = id;
    next();
  } catch (err) {
    console.error(`Authentication error ${err}`);
    return res.status(401).json({
      message: "Session expired or invalid. Please login again.",
    });
  }
}

module.exports = {
  Info_Post_middleware,
  Info_delete_middleware,
  Info_update_middleware,
  info_auth_middleware
};
