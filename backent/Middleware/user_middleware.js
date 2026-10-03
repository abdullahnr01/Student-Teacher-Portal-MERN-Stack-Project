const User = require("../Model/user_model");

const SignUp_middleware = async (req, res, next) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    let errors = [];

    if (!firstname || firstname.trim === "") {
      errors.push("First Name is Required - ");
    }
    if (!lastname || lastname.trim === "") {
      errors.push("Last Name is Required - ");
    }
    if (!email || email.trim === "") {
      errors.push("Email is Required - ");
    }
    if (!password || password.trim === "") {
      errors.push("Password is Required - ");
    }

    if (errors.length > 0) {
      return res.status(400).json({ message: errors });
    }

    const User_exist = await User.findOne({ email });
    if (User_exist) {
      return res.status(409).json({ message: "User already exist this email" });
    }
    next();
  } catch (err) {
    console.error(`Signup Error: ${err}`);
    return res.status(500).json({ message: "Internal Server error." });
  }
};

const SignIn_middleware = async (req, res, next) => {
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

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email." });
    }

    next();
  } catch (err) {
    console.error(`SignIn middleware Error: ${err}`);
    return res.status(500).json({ message: "Internal Server error." });
  }
};

//
const delete_middleware = (req, res, next) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: "Id not found" });
    }
    next();
  } catch (err) {
    console.error(`Deleting Id error ${err}`);
    return res.status(500).json({ message: "Internal Server error." });
  }
};

const patch_data_middleware = async (req, res, next) => {
  try {
    const { _id } = req.body;
    if (!_id) {
      return res.status(400).json({ message: "Id is required" });
    }
    next();
  } catch (err) {
    console.error("Updating data error:", err);
    return res.status(500).json({ message: "Internal Server error." });
  }
};

module.exports = {
  SignUp_middleware,
  SignIn_middleware,
  delete_middleware,
  patch_data_middleware,
};
