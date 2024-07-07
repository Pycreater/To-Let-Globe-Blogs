const { ApiError } = require('../utils/ApiError.js');
const { ApiResponse } = require('../utils/ApiResponse.js');
const { asyncHandler } = require('../utils/asyncHandler.js');
const Blog = require('../models/blog.models.js');
const {
  uploadOnCloudinary,
  deleteImageOnCloudinary,
} = require('../utils/cloudinary.js');
const { UserRolesEnum } = require('../constants.js');
const { default: mongoose } = require('mongoose');

const getAllBlogs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 6, sortType = 'latest' } = req.query;
  const userId = req.user?._id;

  // Stage 1: Aggregate blogs with totalLikes and isUserLiked
  let pipeline = [
    {
      $lookup: {
        from: 'likes',
        let: { blogId: '$_id' },
        pipeline: [
          { $match: { $expr: { $eq: ['$blogId', '$$blogId'] } } },
          { $project: { likedBy: 1 } },
        ],
        as: 'likes',
      },
    },
    {
      $addFields: {
        totalLikes: { $size: '$likes' },
        isUserLiked: {
          $in: [new mongoose.Types.ObjectId(userId), '$likes.likedBy'],
        },
      },
    },
    {
      $project: {
        _id: 1,
        heading: 1,
        subHeading: 1,
        totalLikes: 1,
        blogImage: 1,
        blogCategory: 1,
        content: 1,
        author: 1,
        isUserLiked: 1,
        createdAt: 1,
      },
    },
  ];

  // Stage 2: Sorting based on sortType
  if (sortType === 'latest') {
    pipeline.push({ $sort: { createdAt: -1 } }); // Sort by latest createdAt first
  } else if (sortType === 'trending') {
    pipeline.push({ $sort: { totalLikes: -1 } }); // Sort by most totalLikes first
  }

  // Stage 3: Paginate the aggregated blogs manually
  const blogsAggregates = await Blog.aggregate(pipeline);
  const totalBlogs = blogsAggregates.length;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const blogs = blogsAggregates.slice(startIndex, endIndex);

  return res
    .status(200)
    .json(
      new ApiResponse(200, { blogs, totalBlogs }, 'Blogs fetched successfully')
    );
});

const getBlogById = asyncHandler(async (req, res) => {
  const blogId = req.params?.blogId;
  const userId = req.user?._id;
  console.log('user id is ', userId);

  const blogs = await Blog.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(blogId),
      },
    },
    {
      $lookup: {
        from: 'likes', // Adjust this to your actual likes collection name
        let: { blogId: '$_id' },
        pipeline: [
          { $match: { $expr: { $eq: ['$blogId', '$$blogId'] } } },
          { $project: { likedBy: 1 } },
        ],
        as: 'likes',
      },
    },
    {
      $addFields: {
        totalLikes: { $size: '$likes' },
        isUserLiked: {
          $in: [new mongoose.Types.ObjectId(userId), '$likes.likedBy'],
        },
      },
    },
    {
      $project: {
        _id: 1,
        heading: 1,
        subHeading: 1,
        totalLikes: 1,
        blogImage: 1,
        blogCategory: 1,
        content: 1,
        author: 1,
        isUserLiked: 1,
      },
    },
  ]);

  if (!blogs) {
    throw new ApiError(404, 'No blogs found ');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, blogs, 'Blog fetched successfully'));
});

const getMyBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({ author: req.user?._id });
  return res
    .status(200)
    .json(new ApiResponse(200, blogs, 'Blogs fetched successfully'));
});

const createBlog = asyncHandler(async (req, res) => {
  const { heading, content, subHeading, blogCategory } = req.body;
  const author = req.user?._id;

  const localImagePath = req.file?.path;

  if (!localImagePath) {
    throw new ApiError(400, 'Blog Image is required');
  }

  const { public_id, url } = await uploadOnCloudinary(localImagePath);

  const blog = await Blog.create({
    heading,
    content,
    subHeading,
    blogCategory,
    author,
    blogImage: { public_id, url },
  });

  if (!blog) {
    throw new ApiError(500, 'Failed to create blog');
  }
  return res
    .status(201)
    .json(new ApiResponse(201, blog, 'Blog created successfully'));
});

const updateBlog = asyncHandler(async (req, res) => {
  const { heading, content, subHeading, blogCategory } = req.body;

  const blog = await Blog.findById(req.params.blogId);
  if (!blog) {
    throw new ApiError(404, 'Blog not found');
  }

  if (
    req.user?._id.toString() !== blog.author.toString() ||
    req.user?.role === UserRolesEnum.ADMIN
  ) {
    throw new ApiError(403, 'Unauthorized to delete this blog');
  }

  const imageLocalPath = req.file?.path;
  let blogImage = blog.blogImage;

  if (imageLocalPath) {
    const { public_id, url } = await uploadOnCloudinary(imageLocalPath);
    if (blog.blogImage.public_id) {
      await deleteImageOnCloudinary(blog.blogImage.public_id);
    }
    blogImage = { public_id, url };
  }

  const updatedBlog = {
    heading: heading || blog.heading,
    content: content || blog.content,
    subHeading: subHeading || blog.subHeading,
    blogCategory: blogCategory || blog.blogCategory,
    blogImage: blogImage,
  };

  Object.assign(blog, updatedBlog);
  await blog.save();

  return res
    .status(200)
    .json(new ApiResponse(200, blog, 'Blog updated successfully'));
});

const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.blogId);

  if (!blog) {
    throw new ApiError(404, 'Blog not found');
  }

  if (
    req.user?._id.toString() !== blog.author.toString() ||
    req.user?.role === UserRolesEnum.ADMIN
  ) {
    throw new ApiError(403, 'Unauthorized to delete this blog');
  }

  if (blog.blogImage?.public_id) {
    await deleteImageOnCloudinary(blog.blogImage.public_id);
  }

  await blog.deleteOne();
  return res
    .status(200)
    .json(new ApiResponse(200, null, 'Blog deleted successfully'));
});

module.exports = {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  getMyBlogs,
};
