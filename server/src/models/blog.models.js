const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const blogSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    blogImage: {
      type: {
        url: String,
        public_id: String,
      },
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    blogCategory: {
      type: String,
      required: true,
    },
    subHeading: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// add for pagination purposes
blogSchema.plugin(aggregatePaginate);

module.exports = mongoose.model('Blog', blogSchema);
