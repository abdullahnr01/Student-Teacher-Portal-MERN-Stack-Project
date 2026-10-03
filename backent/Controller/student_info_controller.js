const StudentInfo = require("../Model/student_info_model");

const Stud_Info_Post_Controller = async (req, res) => {
  try {
    const { room_no, subject, grade, attendance } = req.body;

    const newStudentInfo = await StudentInfo.create({
      room_no: room_no,
      subject: subject,
      grade: grade,
      attendance: attendance,
      studentId: req.student_id,
    });

    return res.status(200).json({ message: "Info Added Successfully!" });
  } catch (err) {
    console.error(`Post Course Error: ${err}`);
    return res.status(500).json({ message: "Internal Server error." });
  }
};
// const Stud_Info_Get_Controller = async (req, res) => {
//   try {
//     // const GetStudentInfo = await StudentInfo.find(query);

//     // res.status(200).json(GetStudentInfo);
//     const { room_no, subject, grade, attendance } = req.query;
//     let query = { studentId: req.student_id };
//     if (room_no) query.room_no = { $regex: room_no, $options: "i" };
//     if (subject) query.subject = { $regex: subject, $options: "i" };
//     if (grade) query.grade = { $regex: grade, $options: "i" };
//     if (attendance)
//       query.attendance.toString() = { $regex: attendance.toString(), $options: "i" };

//     const GetStudentInfo = await StudentInfo.find(query);
//     res.status(200).json(GetStudentInfo);
//   } catch (err) {
//     console.error(`Get Info error ${err}`);
//     return res.status(500).json({ message: "Internal Server error" });
//   }
// };

const Stud_Info_Get_Controller = async (req, res) => {
  try {
    const { room_no, subject, grade, attendance } = req.query;
    const attendanceRaw = req.query.attendance;

    let baseQuery = { studentId: req.student_id };

    let orConditions = [];

    if (room_no)
      orConditions.push({ room_no: { $regex: room_no, $options: "i" } });
    if (subject)
      orConditions.push({ subject: { $regex: subject, $options: "i" } });
    if (grade) orConditions.push({ grade: { $regex: grade, $options: "i" } });

    if (attendanceRaw !== undefined && attendanceRaw !== "") {
      const attendanceNumber = Number(attendanceRaw);
      if (!Number.isNaN(attendanceNumber)) {
        orConditions.push({ attendance: attendanceNumber });
      }
    }

    let query =
      orConditions.length > 0 ? { ...baseQuery, $or: orConditions } : baseQuery;

    const GetStudentInfo = await StudentInfo.find(query);
    res.status(200).json(GetStudentInfo);
  } catch (err) {
    console.error(`Get Info error ${err}`);
    return res.status(500).json({ message: "Internal Server error" });
  }
};

const Stud_Info_Delete_Controller = async (req, res) => {
  try {
    const { StudentInfo_Id } = req.query;
    const delete_user = await StudentInfo.findByIdAndDelete(StudentInfo_Id);
    if (!delete_user) {
      return res.status(404).json({ message: "Id is invalid" });
    }

    return res.status(200).json({ message: "Info Successfully Delete" });
  } catch (err) {
    console.error(`Info Deleting error ${err}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const Stud_Info_Patch_Controller = async (req, res) => {
  try {
    const { room_no, subject, grade, attendance, _id } = req.body;

    const existingcourse = await StudentInfo.findById(_id);
    if (!existingcourse) {
      return res.status(404).json({ message: "Info Invalid" });
    }

    const UpdateField = {};

    if (room_no) UpdateField.room_no = room_no;
    if (subject) UpdateField.subject = subject;
    if (grade) UpdateField.grade = grade;
    if (attendance) UpdateField.attendance = attendance;

    const UpdateInfo = await StudentInfo.findByIdAndUpdate(
      _id,
      { $set: UpdateField },
      { new: true }
    );

    return res.status(200).json({ message: "Info Data Update Successfully" });
  } catch (err) {
    console.error(`Data Updating error ${err}`);
    return res.status(500).json({ message: "Internal Server error." });
  }
};

module.exports = {
  Stud_Info_Post_Controller,
  Stud_Info_Patch_Controller,
  Stud_Info_Get_Controller,
  Stud_Info_Delete_Controller,
};
