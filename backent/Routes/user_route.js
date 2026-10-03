const express = require("express");
const router = express.Router();

const {
  delete_middleware,
  SignUp_middleware,
  SignIn_middleware,
  patch_data_middleware
} = require("../Middleware/user_middleware");

const {
  signUp_Controller,
  get_data_Controller,
  delete_data_Controller,
  signIn_Controller,
  patch_data_Controller
} = require("../Controller/user_controller");

router.get("/getdata", get_data_Controller);
router.post("/signUp", SignUp_middleware, signUp_Controller);
router.post("/signIn", SignIn_middleware, signIn_Controller);
router.delete("/delete", delete_middleware, delete_data_Controller);
router.patch("/update",patch_data_middleware , patch_data_Controller )

module.exports = router;
