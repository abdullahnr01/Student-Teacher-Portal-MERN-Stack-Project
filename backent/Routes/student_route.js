const express = require("express");
const router = express.Router();

const {
  delete_middleware,
  SignUp_middleware,
  patch_data_middleware,
  Sendemail_middlewale,
  auth_middleware,
  student_login_middleware,
} = require("../Middleware/student_middleware");

const {
  signUp_Controller,
  get_data_Controller,
  delete_data_Controller,
  patch_data_Controller,
  Sendemail_controller,
  login_Controller,
} = require("../Controller/student_controller");

router.get("/getdata", auth_middleware, get_data_Controller);
router.post("/signUp", auth_middleware, SignUp_middleware, signUp_Controller);
router.post("/stdlogin", student_login_middleware, login_Controller);
router.delete(
  "/delete",
  auth_middleware,
  delete_middleware,
  delete_data_Controller
);
router.patch(
  "/update",
  auth_middleware,
  patch_data_middleware,
  patch_data_Controller
);
router.post(
  "/send-email",
  auth_middleware,
  Sendemail_middlewale,
  Sendemail_controller
);

module.exports = router;
