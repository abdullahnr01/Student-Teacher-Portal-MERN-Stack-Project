const { Schema, model } = require("mongoose");

const studentSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    degree: { type: String, required: true },
    date_of_birth: { type: Date, required: true },
    teacher_Id: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
    password: {
      type: String,
      default: null,
    },
  },

  { timestamps: true }
);

const Student = model("Student", studentSchema);

module.exports = Student;
