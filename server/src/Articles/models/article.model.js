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
        ref: 'User', // Changed from 'Contributor' to 'User' for consistency
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
    // Adding view tracking
    views: {
      count: {
        type: Number,
        default: 0,
      },
      // To track unique viewers by IP address or session ID
      viewers: [
        {
          identifier: String, // IP address or session ID
          timestamp: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

// Add an index for faster retrieval of popular articles
ArticleSchema.index({ 'views.count': -1 });

export default mongoose.model('Article', ArticleSchema);
