import "quill/dist/quill.snow.css";
import React, { useState, useRef, useEffect } from "react";
import Quill from "quill";
import "../App.css";
import { addBlog } from "../api";
import { TailSpin } from "react-loader-spinner";
import { requestHandler } from "../util";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const AddBlog = () => {
  const [heading, setHeading] = useState("");
  const [subHeading, setSubHeading] = useState("");
  const [content, setContent] = useState("");
  const [blogImage, setBlogImage] = useState(null);
  const [blogCategory, setBlogCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const quillRef = useRef(null);
  const quillInstanceRef = useRef(null);

  useEffect(() => {
    if (quillRef.current) {
      quillInstanceRef.current = new Quill(quillRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [
              { list: "ordered" },
              { list: "bullet" },
              { indent: "-1" },
              { indent: "+1" },
            ],
            ["link", "image"],
            ["clean"],
          ],
        },
        placeholder: "Content",
      });

      quillInstanceRef.current.on("text-change", () => {
        setContent(quillInstanceRef.current.root.innerHTML);
      });
    }
  }, []);

  const addBlogHandler = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!heading || !subHeading || !content || !blogCategory || !blogImage) {
      toast.error("All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("heading", heading);
    formData.append("subHeading", subHeading);
    formData.append("content", content);
    formData.append("blogImage", blogImage);
    formData.append("blogCategory", blogCategory);

    await requestHandler(
      async () => await addBlog(formData),
      setIsLoading,
      () => {
        resetForm();
        navigate("/blogs");
        toast.success("Blog created successfully!");
      },
      (message) => {
        toast.error(message);
      }
    );
  };

  const resetForm = () => {
    setHeading("");
    setSubHeading("");
    setContent("");
    setBlogImage(null);
    setBlogCategory("");
    quillInstanceRef.current.setContents([]);
  };

  return (
    <div className="min-h-screen p-4">
      <form
        onSubmit={addBlogHandler}
        className="md:p-6 p-3 rounded-lg shadow-lg max-w-screen-md w-full mx-auto"
      >
        <h1 className="text-3xl text-center mb-4 font-bold">Create Blog</h1>
        <label htmlFor="heading" className="text-white text-sm py-5">
          Heading
        </label>
        <input
          type="text"
          placeholder="Enter blog post heading"
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
          className="w-full py-3 px-4 mb-4 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#ffffff91] text-white rounded"
        />
        <label htmlFor="subheading" className="text-white text-sm py-5">
          Sub Heading
        </label>
        <textarea
          placeholder="Sub Heading"
          value={subHeading}
          onChange={(e) => setSubHeading(e.target.value)}
          className="w-full py-3 px-4 mb-4 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#ffffff91] text-white rounded"
          rows="4"
        />
        <label htmlFor="category" className="text-white text-sm py-5">
          Blog Category
        </label>
        <input
          type="text"
          placeholder="News, Sports or Technology"
          value={blogCategory}
          onChange={(e) => setBlogCategory(e.target.value)}
          className="w-full py-3 px-4 mb-4 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#ffffff91] text-white rounded"
        />
        <label htmlFor="image" className="text-white text-sm py-5">
          Blog Image
        </label>
        <input
          type="file"
          onChange={(e) => setBlogImage(e.target.files[0])}
          className="w-full py-3 px-4 mb-4 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#ffffff91] text-white rounded"
        />
        <label htmlFor="content" className="text-white text-sm py-5">
          Content
        </label>
        <div ref={quillRef} className="custom-quill rounded"></div>
        <button
          type="submit"
          className="w-full py-3 bg-[#2e8f83] text-white rounded hover:bg-[#34a394] mt-8 flex justify-center items-center"
        >
          {isLoading ? (
            <TailSpin
              visible={true}
              height="30"
              width="30"
              color="#fff"
              ariaLabel="tail-spin-loading"
              radius="1"
              wrapperStyle={{}}
              wrapperClass=""
            />
          ) : (
            "Create Post"
          )}
        </button>
      </form>
    </div>
  );
};

export default AddBlog;
