import React, { useCallback, useState } from "react";
import { FaHeart, FaRegHeart, FaLongArrowAltRight } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toggleBlogLike } from "../api";
import { toast } from "sonner";
import { requestHandler } from "../util";

const BlogCard = ({ data }) => {
  const [isUserLiked, setIsUserLiked] = useState(data.isUserLiked);
  const [totalLikes, setTotalLikes] = useState(data.totalLikes);

  const navigate = useNavigate();
  // this function for formatting the date
  const formatMongoDate = (createdAt) => {
    const date = new Date(createdAt);

    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", options);

    return `${formattedDate}`;
  };

  function getFirst40Words(para) {
    const words = para.trim().split(/\s+/);
    if (words.length <= 10) {
      return para;
    }

    return words.slice(0, 10).join(" ") + "...";
  }

  const toggleLikeHandler = useCallback(async () => {
    await requestHandler(
      async () => await toggleBlogLike(data._id),
      null,
      (data) => {
        toast.success(data.message);
      },
      (message) => {
        // Handle error message display (toast.error(message))
        console.error(message);
      }
    );
  }, []);

  return (
    <div className="w-full  h-full   rounded-xl  duration-150 ease-in-out">
      <div className="w-full  overflow-hidden max-h-[250px] h-full">
        <img
          src={data.blogImage.url}
          alt=""
          className="w-full h-full rounded-md"
        />
      </div>
      <p className="text-sm text-gray-400 mb-2">
        {formatMongoDate(data.createdAt)} | {data.blogCategory}
      </p>
      <div className="my-2">
        <h1 className="text-base ">{getFirst40Words(data.heading)}</h1>
      </div>
      <div className="my-2">
        <div
          dangerouslySetInnerHTML={{ __html: getFirst40Words(data.content) }}
        />
      </div>
      <div className="my-4">
        <Link
          to={`/blogs/${data._id}`}
          className="text-sm text-[#3cbcb1] hover:underline flex gap-2 items-center "
          target="_self"
        >
          Read more <FaLongArrowAltRight />
        </Link>
      </div>
      <div className="flex md:flex-row flex-col md:items-center items-start justify-between">
        <div className="flex items-center gap-4 justify-start">
          <div className="w-[35px] rounded-full overflow-hidden">
            <img
              src="https://res.cloudinary.com/dcvb5vgyf/image/upload/c_scale,h_500,w_500/oysy3d5lzxjzjp8am3bi.jpg"
              alt="avatar"
              className="w-full"
            />
          </div>
          <div>
            <h1 className="text-white text-sm">{data.author.username}</h1>
            <p className="text-sm text-gray-400 ">{data.author.email}</p>
          </div>
        </div>

        <div className="flex gap-2 items-center justify-start">
          <div
            className="my-4 cursor-pointer"
            onClick={() => {
              if (isUserLiked) setTotalLikes((prev) => prev - 1);
              if (!isUserLiked) setTotalLikes((prev) => prev + 1);
              setIsUserLiked(!isUserLiked);
              toggleLikeHandler();
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
      </div>
    </div>
  );
};

export default BlogCard;
