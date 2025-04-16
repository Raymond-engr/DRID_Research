import mongoose from 'mongoose';

const FacultySchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      maxlength: 10,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 255,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Faculty', FacultySchema);
