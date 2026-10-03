const express = require("express");
const router = express.Router();

const {
  Stud_Info_Get_Controller,
  Stud_Info_Post_Controller,
  Stud_Info_Patch_Controller,
  Stud_Info_Delete_Controller,
} = require("../Controller/student_info_controller");

const {
  Info_Post_middleware,
  Info_delete_middleware,
  Info_update_middleware,
  info_auth_middleware,
} = require("../Middleware/student_info.middleware");

router.get("/getcourse", info_auth_middleware, Stud_Info_Get_Controller);
router.post(
  "/postcourse",
  info_auth_middleware,
  Info_Post_middleware,
  Stud_Info_Post_Controller
);
router.delete(
  "/deletecourse",
  info_auth_middleware,
  Info_delete_middleware,
  Stud_Info_Delete_Controller
);
router.patch(
  "/patchcourse",
  info_auth_middleware,
  Info_update_middleware,
  Stud_Info_Patch_Controller
);

module.exports = router;
