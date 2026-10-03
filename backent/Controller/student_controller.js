const Student = require("../Model/student_model");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const signUp_Controller = async (req, res) => {
  try {
    const { name, email, degree, date_of_birth } = req.body;

    const newStudent = await Student.create({
      name: name,
      degree: degree,
      email: email,
      date_of_birth: date_of_birth,
      teacher_Id: req.teacherId,
    });
    return res.status(200).json({ message: "Student Sign up successful!" });
  } catch (err) {
    console.error(`Signup Error: ${err}`);
    return res.status(500).json({ message: "Internal Server error." });
  }
};

const login_Controller = async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ email });
    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Wrong password." });
    }

    const token = jwt.sign({ id: student._id }, process.env.StdSecretKey, {
      expiresIn: "20h",
    });

    return res
      .status(200)
      .json({ message: "Student Login Successfully", token });
  } catch (err) {
    console.error(`SigIn Controller Error: ${err}`);
    return res.status(500).json({ message: "Internal Server error." });
  }
};

const get_data_Controller = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;
    const students = await Student.find({ teacher_Id: req.teacherId })
      .skip(skip)
      .limit(limit);

    const total_student = await Student.countDocuments({
      teacher_Id: req.teacherId,
    });

    res.status(200).json({
      total_student,
      students,
      limit,
      page,
    });
  } catch (err) {
    console.error(`Get Data error ${err}`);
    return res.status(500).json({ message: "Internal Server Error server" });
  }
};

const delete_data_Controller = async (req, res) => {
  try {
    const { StudentId } = req.query;
    const delete_student = await Student.findByIdAndDelete(StudentId);
    if (!delete_student) {
      return res.status(404).json({ error: "Id is invalid" });
    }

    return res.status(200).json({ message: "User Successfully Delete" });
  } catch (err) {
    console.error(`Data Deleting error ${err}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const patch_data_Controller = async (req, res) => {
  try {
    const { name, email, degree, date_of_birth, _id } = req.body;
    const existingStudent = await Student.findById(_id);
    if (!existingStudent) {
      return res.status(404).json({ message: "User not found" });
    }
    const UpdateField = {};

    if (name) UpdateField.name = name;
    if (degree) UpdateField.degree = degree;
    if (date_of_birth) UpdateField.date_of_birth = date_of_birth;

    const Updatestudent = await Student.findByIdAndUpdate(
      _id,
      { $set: UpdateField },
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "Student Data Update successfully!" });
  } catch (err) {
    console.error(`Data Updating error ${err}`);
    return res.status(500).json({ message: "Internal Server error." });
  }
};

function generatePassword() {
  const capitalLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const smallLetters = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const specialChars = "!@#$&";

  const capital =
    capitalLetters[Math.floor(Math.random() * capitalLetters.length)];
  const small = smallLetters[Math.floor(Math.random() * smallLetters.length)];
  const special = specialChars[Math.floor(Math.random() * specialChars.length)];

  let password = capital + small + special;

  for (let i = 0; i < 5; i++) {
    password += numbers[Math.floor(Math.random() * numbers.length)];
  }

  password = password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");

  return password;
}

const Sendemail_controller = async (req, res) => {
  try {
    const { email } = req.body;
    const User = await Student.findOne({ email: email.toLowerCase().trim() });
    if (!User) return res.status(404).json({ message: "User not found" });

    const Random_Password = generatePassword();
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(Random_Password, saltRounds);
    const oldhashedpassword = User.password;

    await Student.findOneAndUpdate(
      { email: email },
      { $set: { password: hashedPassword } }
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "abdullahbusinessidea0101@gmail.com",
        pass: "fmffudcusagemxjp",
      },
    });

    const mailOptions = {
      from: "abdullahbusinessidea0101@gmail.com",
      to: email,
      subject: "Password",
      text: `Your password is ${Random_Password}`,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      return res.status(200).json({
        message: "Your password has been sent successfully to your email!",
      });
    } catch (err) {
      console.error("Mail send failed, rolling back password update:");
      await Student.findOneAndUpdate(
        { email: email },
        { $set: { password: oldhashedpassword } }
      );
      return res.status(500).json({
        message: "Failed to send email password. Plz try again",
      });
    }
  } catch (err) {
    console.error(`Send email error ${err}`);
    return res.status(500).json({ message: "Internal Server error. Email" });
  }
};

module.exports = {
  signUp_Controller,
  get_data_Controller,
  delete_data_Controller,
  patch_data_Controller,
  Sendemail_controller,
  login_Controller,
};
