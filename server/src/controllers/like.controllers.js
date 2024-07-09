const Like = require('../models/like.models.js');
const { ApiError } = require('../utils/ApiError.js');
const { ApiResponse } = require('../utils/ApiResponse.js');
const { asyncHandler } = require('../utils/asyncHandler.js');

const toggleLike = asyncHandler(async (req, res) => {
  const { blogId } = req.params;

  if (!blogId) {
    throw new ApiError('Blog Id is missing');
  }

  const likedDoc = await Like.findOne({
    likedBy: req.user._id,
    blogId: blogId,
  });

  if (likedDoc) {
    await Like.findOneAndDelete({
      likedBy: req.user._id,
      blogId: blogId,
    });
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          likeStatus: false,
        },
        'Un liked successfully'
      )
    );
  }

  await Like.create({
    likedBy: req.user._id,
    blogId: blogId,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        likeStatus: true,
      },
      'Liked successfully'
    )
  );
});

const getMyLikedBlogs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 6 } = req.query;

  // Stage 1: Match likes by user id
  let pipeline = [
    {
      $match: {
        likedBy: req.user._id,
      },
    },
    {
      $lookup: {
        from: 'blogs',
        localField: 'blogId',
        foreignField: '_id',
        as: 'blogs',
      },
    },
    {
      $unwind: '$blogs',
    },
    {
      $replaceRoot: {
        newRoot: '$blogs',
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
        totalLikes: 1, // You may want to calculate totalLikes differently for liked blogs
        blogImage: 1,
        blogCategory: 1,
        content: 1,
        author: {
          username: '$author.username',
          email: '$author.email',
        },
        isUserLiked: true, // Assuming all blogs in this response are liked by the user
        createdAt: 1,
      },
    },
  ];

  // Stage 2: Paginate the liked blogs manually
  const likedBlogsAggregates = await Like.aggregate(pipeline);
  const totalLikedBlogs = likedBlogsAggregates.length;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const likedBlogs = likedBlogsAggregates.slice(startIndex, endIndex);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { blogs: likedBlogs, totalBlogs: totalLikedBlogs },
        'Liked blogs fetched successfully'
      )
    );
});

module.exports = { toggleLike, getMyLikedBlogs };
