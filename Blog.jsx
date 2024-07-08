import React, { useState } from "react";
import './blog.css';

// Importing images from assets folder
import Blog1 from '../../assets/Blog1.png';
import Blog2 from '../../assets/Blog2.png';
import Blog3 from '../../assets/Blog3.png';
import Blog4 from '../../assets/Blog4.png';
import Blog5 from '../../assets/Blog5.png';
import Blog6 from '../../assets/Blog6.png';

export default function Blog() {
  const [view, setView] = useState('trending');

  const handleViewChange = (viewType) => {
    setView(viewType);
  };

  const blogs = [
    { id: 1, title: "Trending Blog 1", description: "Description for Trending Blog 1", category: "trending", image: Blog1, date: "2 Nov, 23" },
    { id: 2, title: "Trending Blog 2", description: "Description for Trending Blog 2", category: "trending", image: Blog2, date: "21 Feb, 24" },
    { id: 3, title: "Trending Blog 3", description: "Description for Trending Blog 3", category: "trending", image: Blog3, date: "18 Nov, 23" },
    { id: 4, title: "Trending Blog 4", description: "Description for Trending Blog 4", category: "trending", image: Blog4, date: "22 Feb, 24" },
    { id: 5, title: "Trending Blog 5", description: "Description for Trending Blog 5", category: "trending", image: Blog5, date: "2 Nov, 23" },
    { id: 6, title: "Trending Blog 6", description: "Description for Trending Blog 6", category: "trending", image: Blog6, date: "4 Jan, 24" },
  ];

  const filteredBlogs = blogs.filter(blog => blog.category === view && view === 'trending');

  return (
    <div className="blog">
      <div className="desc">
        <h1>To-Let Tales</h1>
        <p>Dive into a Sea of Endless Stories and Insights</p>
      </div>
      <div className="blog-top-container">
        <div className="blog-top">
          <div className="button-container">
            <button onClick={() => handleViewChange('trending')} className={view === 'trending' ? 'active' : ''}>Trending</button>
          </div>
          <div className="button-container">
            <button onClick={() => handleViewChange('latest')} className={view === 'latest' ? 'active' : ''}>Latest</button>
          </div>
        </div>
      </div>
      <div className="blog-grid">
        {filteredBlogs.map((blog) => (
          <div key={blog.id} className="blog-card">
            <img src={blog.image} alt={blog.title} className="blog-image" />
            <div className="blog-content">
              <h2>{blog.title}</h2>
              <p>{blog.description}</p>
            </div>
            <p className="blog-date">{blog.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
