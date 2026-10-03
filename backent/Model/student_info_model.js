const { Schema, model } = require("mongoose");

const StudentInfoSchema = new Schema(
  {
    room_no: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    grade: {
      type: String,
      enum: ["A", "B", "C", "D", "E", "F", "A+"],
      required: true,
    },
    attendance: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student", 
      required: true,
    },
  },
  { timestamps: true }
);


const StudentInfo = model("StudentInfo", StudentInfoSchema);

module.exports = StudentInfo;
