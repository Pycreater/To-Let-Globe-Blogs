import React, { useState } from "react";
import { FaHeart, FaRegHeart, FaLongArrowAltLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

const Blog = () => {
  const data = {
    _id: "668ae5298f190c8e296ef5d3",
    heading: "Health Benefits of Yoga",
    content:
      "Yoga can significantly improve both physical and mental health. Practicing yoga regularly enhances flexibility, builds muscle strength, and helps with relaxation and stress reduction.",
    blogImage: {
      url: "http://res.cloudinary.com/dcvb5vgyf/image/upload/v1720378664/gcleftzcwfqhffrm6klc.jpg",
      public_id: "gcleftzcwfqhffrm6klc",
      _id: "668ae5298f190c8e296ef5d4",
    },
    author: {
      username: "jayash",
      email: "jayash@gmail.com",
    },
    subHeading: `Yoga is a holistic practice that integrates physical postures, breathing exercises, and meditation. It is known for its numerous health benefits, including improved flexibility, strength, and mental clarity. Regular yoga practice can also help reduce stress, improve cardiovascular health, and promote overall well-being. Yoga is a holistic practice that integrates physical postures, breathing exercises, and meditation. It is known for its numerous health benefits, including improved flexibility, strength, and mental clarity. Regular yoga practice can also help reduce stress, improve cardiovascular health, and promote overall well-being. Yoga is a holistic practice that integrates physical postures, breathing exercises, and meditation. It is known for its numerous health benefits, including improved flexibility, strength, and mental clarity. Regular yoga practice can also help reduce stress, improve cardiovascular health, and promote overall well-being.`,
    createdAt: "2024-07-07T18:57:45.331Z",
    blogCategory: "Health",
    totalLikes: 2,
    isUserLiked: true,
  };

  const [isUserLiked, setIsUserLiked] = useState(data.isUserLiked);
  const [totalLikes, setTotalLikes] = useState(data.totalLikes);

  // this function for formatting the date
  const formatMongoDate = (createdAt) => {
    const date = new Date(createdAt);

    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", options);

    return `${formattedDate}`;
  };

  // this function for formatting the sub heading
  const addParagraphSpacing = (content, wordLimit) => {
    // Split the content into words
    const words = content.split(" ");
    const paragraphs = [];

    // Create paragraphs with a maximum of wordLimit words each
    for (let i = 0; i < words.length; i += wordLimit) {
      const paragraph = words.slice(i, i + wordLimit).join(" ");
      paragraphs.push(paragraph);
    }

    // Join the paragraphs with two line breaks
    return paragraphs.join("<br /><br />");
  };

  return (
    <div className="w-full min-h-screen h-full md:pt-24 p-5">
      <div className="max-w-screen-md w-full h-full m-auto">
        <p className="text-sm text-gray-400 mb-2">
          {formatMongoDate(data.createdAt)} | {data.blogCategory}
        </p>
        <h1 className="md:text-4xl text-xl font-medium">{data.heading}</h1>
        <div className="my-6">
          <div className="flex items-center gap-4 justify-start">
            <div className="w-[43px] rounded-full overflow-hidden">
              <img
                src="https://res.cloudinary.com/dcvb5vgyf/image/upload/c_scale,h_500,w_500/oysy3d5lzxjzjp8am3bi.jpg"
                alt="avatar"
                className="w-full"
              />
            </div>
            <div>
              <h1 className="text-white">{data.author.username}</h1>
              <p className="text-sm text-gray-400 ">{data.author.email}</p>
            </div>
          </div>
        </div>
        <hr className="h-[1px] bg-slate-400" />
        <div className="flex gap-2 items-center justify-start">
          <div
            className="my-4 cursor-pointer"
            onClick={() => {
              if (isUserLiked) setTotalLikes((prev) => prev - 1);
              if (!isUserLiked) setTotalLikes((prev) => prev + 1);
              setIsUserLiked(!isUserLiked);
            }}
          >
            {isUserLiked ? (
              <FaHeart className="text-red-500" />
            ) : (
              <FaRegHeart className="text-[#3cbcb1]" />
            )}
          </div>
          <p className="text-sm text-gray-400"> {totalLikes} Likes</p>
        </div>
        <hr className="h-[1px] bg-slate-400" />
        <div className="my-6">
          <p className="text-base text-white">{data.content}</p>
        </div>
        <div className="w-full my-4">
          <img src={data.blogImage.url} alt="" className="rounded-md" />
        </div>
        <div className="my-4">
          <p
            className="text-base text-white"
            dangerouslySetInnerHTML={{
              __html: addParagraphSpacing(data.subHeading, 100),
            }}
          ></p>
          <div className="my-6">
            <Link
              to="/"
              className="text-sm text-[#3cbcb1] hover:underline flex gap-2 items-center "
              target="_self"
            >
              <FaLongArrowAltLeft /> Back to blogs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
