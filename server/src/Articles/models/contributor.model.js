import mongoose from 'mongoose';

const ContributorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 255,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    bio: {
      type: String,
      default: '',
    },
    profile_image: {
      type: String, // Path to the uploaded image
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Contributor', ContributorSchema);
