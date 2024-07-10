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
      $lookup: {
        from: 'users', // Adjust to your actual users collection name
        localField: 'author', // Assuming 'author' field holds the ObjectId of the user
        foreignField: '_id',
        as: 'authorDetails',
      },
    },
    {
      $addFields: {
        author: {
          $arrayElemAt: ['$authorDetails', 0],
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
        author: {
          username: '$author.username',
          email: '$author.email',
          _id: '$author._id',
        },
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
      $lookup: {
        from: 'users', // Adjust this to your actual users collection name
        localField: 'author', // Assuming 'author' field holds the ObjectId of the user
        foreignField: '_id',
        as: 'authorDetails',
      },
    },
    {
      $addFields: {
        totalLikes: { $size: '$likes' },
        isUserLiked: {
          $in: [new mongoose.Types.ObjectId(userId), '$likes.likedBy'],
        },
        author: {
          $arrayElemAt: ['$authorDetails', 0],
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
        'author.username': 1,
        'author.email': 1,
        'author._id': 1,
        isUserLiked: 1,
        createdAt: 1,
      },
    },
  ]);

  if (!blogs || blogs.length === 0) {
    throw new ApiError(404, 'No blogs found');
  }

  const formattedBlog = {
    ...blogs[0],
    author: {
      username: blogs[0].author.username,
      email: blogs[0].author.email,
      _id: blogs[0].author._id,
    },
  };

  return res
    .status(200)
    .json(new ApiResponse(200, formattedBlog, 'Blog fetched successfully'));
});

const getMyBlogs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 6 } = req.query;
  const userId = req.user._id;

  // Stage 1: Aggregate blogs with totalLikes and isUserLiked
  let pipeline = [
    {
      $match: { author: new mongoose.Types.ObjectId(userId) },
    },
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
      $lookup: {
        from: 'users',
        localField: 'author',
        foreignField: '_id',
        as: 'authorDetails',
      },
    },
    {
      $addFields: {
        author: {
          $arrayElemAt: ['$authorDetails', 0],
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
        author: {
          username: '$author.username',
          email: '$author.email',
          _id: '$author._id',
        },
        isUserLiked: 1,
        createdAt: 1,
      },
    },
  ];

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
