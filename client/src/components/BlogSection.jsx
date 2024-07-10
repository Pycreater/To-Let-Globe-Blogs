import React, { useEffect, useState, useCallback } from "react";
import BlogCard from "./BlogCard";
import { getAllBlogs, getFavoritesBlog, getMyBlogs } from "../api";
import { requestHandler } from "../util";
import { MutatingDots } from "react-loader-spinner";

const BlogSection = ({ blogsType }) => {
  // Destructure blogsType from props
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [showMoreLoader, setShowMoreLoader] = useState(false);
  const [limit, setLimit] = useState(6);
  const [isShowMore, setIsShowMore] = useState(false);

  const blogsHandler = useCallback(async () => {
    await requestHandler(
      async () => await getAllBlogs(blogsType, page, limit),
      setShowMoreLoader,
      (data) => {
        setBlogs((prev) => {
          const currentBlogs = [...prev, ...data.data.blogs];
          setIsShowMore(data.data.totalBlogs > currentBlogs.length);
          return currentBlogs;
        });
      },
      (message) => {
        // Handle error message display (toast.error(message))
        console.error(message);
      }
    );
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (blogsType === "favorites") {
        await requestHandler(
          async () => await getFavoritesBlog(page, limit),
          setShowMoreLoader,
          (data) => {
            setBlogs((prev) => {
              const currentBlogs = [...prev, ...data.data.blogs];
              setIsShowMore(data.data.totalBlogs > currentBlogs.length);
              return currentBlogs;
            });
          },
          (message) => {
            // Handle error message display (toast.error(message))
            console.error(message);
          }
        );
      } else if (blogsType === "myBlogs") {
        await requestHandler(
          async () => await getMyBlogs(page, limit),
          setShowMoreLoader,
          (data) => {
            setBlogs((prev) => {
              const currentBlogs = [...prev, ...data.data.blogs];
              setIsShowMore(data.data.totalBlogs > currentBlogs.length);
              return currentBlogs;
            });
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
  }, [page]);

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
    <div>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-20">
        {blogs.map((blog) => (
          <BlogCard key={blog._id} data={blog} />
        ))}
      </div>
      {isShowMore &&
        (showMoreLoader ? (
          <div className="w-full h-[300px] flex items-center justify-center">
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
          <div className="w-full mt-20 flex items-center justify-center ">
            <button
              className=" py-2 px-5 border-[#2e8f83] border-[1px] text-base text-white hover:text-[#12332f] rounded hover:bg-[#34a394] duration-150 ease-in-out"
              onClick={() => {
                setLimit((prev) => prev + 6);
                setPage((prev) => prev + 1);
              }}
            >
              Show more
            </button>
          </div>
        ))}
    </div>
  );
};

export default BlogSection;
