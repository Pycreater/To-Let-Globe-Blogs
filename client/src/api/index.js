// Import necessary modules and utilities
import axios from "axios";
import { LocalStorage } from "../util/index.js";

// Create an Axios instance for API requests
const apiClient = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
  timeout: 120000,
});

// Add an interceptor to set authorization header with user token before requests
apiClient.interceptors.request.use(
  function (config) {
    // Retrieve user token from local storage
    const token = LocalStorage.get("token");
    // Set authorization header with bearer token
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// API functions for User actions
const loginUser = (data) => {
  return apiClient.post("/users/login", data);
};

const registerUser = (data) => {
  return apiClient.post("/users/register", data);
};

const logoutUser = () => {
  return apiClient.get("/users/logout");
};

// blogs api

const addBlog = (data) => {
  return apiClient.post("/blogs", data);
};

const getAllBlogs = (sortType = "trending", page = 1, limit = 6) => {
  return apiClient.get(
    `/blogs/?page=${page}&limit=${limit}&sortType=${sortType}`
  );
};

const getBlogById = (blogId) => {
  return apiClient.get(`/blogs/${blogId}`);
};

const deleteBlog = (blogId) => {
  return apiClient.delete(`/blogs/${blogId}`);
};

const getFavoritesBlog = (page = 1, limit = 6) => {
  return apiClient.get(`/likes/self/?page=${page}&limit=${limit}`);
};

const getMyBlogs = (page = 1, limit = 6) => {
  return apiClient.get(`/blogs/self/blogs/?page=${page}&limit=${limit}`);
};

const toggleBlogLike = (blogId) => {
  return apiClient.post(`/likes/${blogId}`);
};

// Export all the API functions
export {
  loginUser,
  logoutUser,
  registerUser,
  addBlog,
  getAllBlogs,
  getBlogById,
  getFavoritesBlog,
  toggleBlogLike,
  getMyBlogs,
  deleteBlog,
};
