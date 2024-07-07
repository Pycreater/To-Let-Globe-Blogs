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
  const blogs = await Like.aggregate([
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
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, blogs, 'Blogs fetched successfully'));
});

module.exports = { toggleLike, getMyLikedBlogs };
