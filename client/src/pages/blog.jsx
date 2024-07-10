import React, { useCallback, useEffect, useState } from "react";
import { FaHeart, FaRegHeart, FaLongArrowAltLeft } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteBlog, getBlogById, toggleBlogLike } from "../api";
import { toast } from "sonner";
import { requestHandler } from "../util";
import { useAuth } from "../context/auth.context";
import Loader from "../components/Loader";

const Blog = () => {
  const { blogId } = useParams();
  const [blog, setBlog] = useState({});
  const [isUserLiked, setIsUserLiked] = useState(false); // Initially assuming the user hasn't liked the blog
  const [totalLikes, setTotalLikes] = useState(0); // Initial total likes count
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const { user } = useAuth();

  // Function to format the date
  const formatMongoDate = (createdAt) => {
    const date = new Date(createdAt);
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", options);
    return `${formattedDate}`;
  };

  // Function to add paragraph spacing
  const addParagraphSpacing = (content, wordLimit) => {
    if (!content) return;
    const words = content.split(" ");
    const paragraphs = [];
    for (let i = 0; i < words.length; i += wordLimit) {
      const paragraph = words.slice(i, i + wordLimit).join(" ");
      paragraphs.push(paragraph);
    }
    return paragraphs.join("<br /><br />");
  };

  // Handler to toggle like
  const toggleLikeHandler = useCallback(async () => {
    await requestHandler(
      async () => await toggleBlogLike(blog._id),
      null,
      (data) => {
        toast.success(data.message);
      },
      (message) => {
        // Handle error message display (toast.error(message))
        console.error(message);
      }
    );
  }, [blog._id]);

  useEffect(() => {
    (async () => {
      await requestHandler(
        async () => await getBlogById(blogId),
        setIsLoading,
        (data) => {
          setBlog(data.data);
          setIsUserLiked(data.data.isUserLiked);
          setTotalLikes(data.data.totalLikes);
        },
        (message) => {
          // Handle error message display (toast.error(message))
          console.error(message);
        }
      );
    })();
  }, [blogId]);

  const deleteHandler = async () => {
    await requestHandler(
      async () => await deleteBlog(blogId),
      setIsLoading,
      (data) => {
        toast.success(data.message);
        navigate("/blogs");
      },
      (message) => {
        // Handle error message display (toast.error(message))
        console.error(message);
      }
    );
  };

  return isLoading ? (
    <Loader />
  ) : (
    <div className="w-full min-h-screen h-full md:pt-24 p-5">
      <div className="max-w-screen-md w-full h-full m-auto">
        <p className="text-sm text-gray-400 mb-2">
          {formatMongoDate(blog.createdAt)} | {blog.blogCategory}
        </p>
        <h1 className="md:text-4xl text-xl font-medium">{blog.heading}</h1>
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
              <h1 className="text-white">{blog.author?.username}</h1>
              <p className="text-sm text-gray-400 ">{blog.author?.email}</p>
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
        <hr className="h-[1px] bg-slate-400" />
        <div className="my-6">
          <div
            className="text-white"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>
        <div className="w-full my-4">
          <img src={blog.blogImage?.url} alt="" className="rounded-md" />
        </div>
        <div className="my-4">
          <p
            className="text-base text-white"
            dangerouslySetInnerHTML={{
              __html: addParagraphSpacing(blog.subHeading, 100),
            }}
          ></p>
          <div className="my-6 flex  items-center justify-between gap-4">
            <Link
              to="/blogs"
              className="text-sm text-[#3cbcb1] hover:underline flex gap-2 items-center "
              target="_self"
            >
              <FaLongArrowAltLeft /> Back to blogs
            </Link>

            {user && user._id && user._id === blog.author?._id && (
              <button
                className=" py-2 px-5 bg-[#2e8f83] text-base text-white rounded hover:bg-[#34a394]"
                onClick={deleteHandler}
              >
                Delete Blog
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
