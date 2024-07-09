import React, { useEffect, useState, useCallback } from "react";
import BlogCard from "./BlogCard";
import { getAllBlogs, getFavoritesBlog } from "../api";
import { requestHandler } from "../util";
import { MutatingDots } from "react-loader-spinner";

const BlogSection = ({ blogsType }) => {
  // Destructure blogsType from props
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const blogsHandler = useCallback(async () => {
    await requestHandler(
      async () => await getAllBlogs(blogsType),
      setIsLoading,
      (data) => {
        setBlogs(data.data.blogs);
      },
      (message) => {
        // Handle error message display (toast.error(message))
        console.error(message);
      }
    );
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      if (blogsType === "favorites") {
        await requestHandler(
          async () => await getFavoritesBlog(),
          setIsLoading,
          (data) => {
            setBlogs(data.data.blogs);
          },
          (message) => {
            // Handle error message display (toast.error(message))
            console.error(message);
          }
        );
      } else {
        try {
          await blogsHandler();
        } catch (error) {
          console.error("Error fetching trending blogs:", error.message);
        }
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return isLoading ? (
    <div className="w-full min-h-[300px] flex items-center justify-center">
      <MutatingDots
        visible={true}
        height="80"
        width="80"
        color="#004445"
        secondaryColor="#2c786c"
        radius="12.5"
        ariaLabel="mutating-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  ) : (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-16">
      {blogs.map((blog) => (
        <BlogCard key={blog._id} data={blog} />
      ))}
    </div>
  );
};

export default BlogSection;
