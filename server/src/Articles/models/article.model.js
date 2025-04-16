import mongoose from 'mongoose';

const ArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 255,
    },
    category: {
      type: String,
      required: true,
      enum: ['Research', 'Innovation', 'Development'],
    },
    content: {
      type: String,
      required: true,
      maxlength: 500,
    },
    cover_photo: {
      type: String,
      required: true,
    },
    contributors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contributor',
      },
    ],
    faculty: {
      type: String,
      ref: 'Faculty',
      required: true,
    },
    department: {
      type: String,
      ref: 'Department',
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    publish_date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Article', ArticleSchema);
