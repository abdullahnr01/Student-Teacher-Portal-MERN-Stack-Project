const User = require("../Model/user_model");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;

const signUp_Controller = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;


    console.log(firstname , lastname)

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await User.create({
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: hashedPassword,
    });
    return res.status(200).json({ message: "Sign up successful!" });
  } catch (err) {
    console.error(`Signup Error: ${err}`);
    return res.status(500).json({ message: "Internal Server error." });
  }
};

const signIn_Controller = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password." });
    }

    const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: "10h" });

    return res
      .status(200)
      .json({ message: "Teacher Login Successfully", token, id: user._id });
  } catch (err) {
    console.error(`SigIn Controller Error: ${err}`);
    return res.status(500).json({ message: "Internal Server error." });
  }
};

const get_data_Controller = async (req, res) => {
  try {
    const user_data = await User.find();
    return res.status(200).json(user_data);
  } catch (err) {
    console.error(`Get Data error ${err}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const delete_data_Controller = async (req, res) => {
  try {
    const { userId } = req.query;
    const delete_user = await User.findByIdAndDelete(userId);
    if (!delete_user) {
      return res.status(404).json({ error: "Id is invalid" });
    }
    return res.status(200).json({ message: "User Successfully Delete" });
  } catch (err) {
    console.error(`Data Deleting error ${err}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const patch_data_Controller = async (req, res) => {
  try {
    const { firstname, lastname, email, password, _id } = req.body;

    const existingUser = await User.findById(_id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const UpdateField = {};

    if (firstname) UpdateField.firstname = firstname;
    if (lastname) UpdateField.lastname = lastname;
    if (password) UpdateField.password = password;

    if (email && email !== existingUser.email) {
      const emailTaken = await User.findOne({ email: email });
      if (emailTaken) {
        return res
          .status(409)
          .json({ message: "User already exist this email" });
      }
      UpdateField.email = email;
    }

    const UpdatedUser = await User.findByIdAndUpdate(
      _id,
      { $set: UpdateField },
      { new: true }
    );

    return res.status(200).json({ message: "Data Update successfully!" });
  } catch (err) {
    console.error(`Data Updating error ${err}`);
    return res.status(500).json({ error: "Internal Server error." });
  }
};

module.exports = {
  signUp_Controller,
  signIn_Controller,
  get_data_Controller,
  delete_data_Controller,
  patch_data_Controller,
};
