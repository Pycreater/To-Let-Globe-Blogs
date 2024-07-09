import React, { useState } from "react";
import PropTypes from "prop-types";
import Loader from "../components/Loader"; // Assuming Loader component is imported
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import BlogSection from "../components/BlogSection";

const Blogs = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState(0);

  const handleOnTabChange = (event, newValue) => {
    setValue(newValue);
  };

  return isLoading ? (
    <Loader />
  ) : (
    <div className="w-full max-w-screen-xl min-h-screen md:pt-24 p-5 m-auto">
      <div className="w-full flex items-center justify-center">
        <div>
          <h1 className="md:text-3xl text-xl text-white text-center">
            Our Insights and Stories
          </h1>
          <p className="text-[#3cbcb1] text-center mt-2 md:text-lg text-sm">
            Insightful Blogs: Your Gateway to Knowledge and Ideas
          </p>
        </div>
      </div>
      <div className="md:my-20 my-14">
        <Box sx={{ width: "100%" }}>
          <Tabs
            value={value}
            onChange={handleOnTabChange}
            centered
            TabIndicatorProps={{ style: { background: "#3cbcb1" } }} // Hide the indicator line
            classes={{ root: "custom-tabs-root" }} // Custom class for Tabs root
          >
            <Tab
              label="Trending"
              {...a11yProps(0)}
              sx={{
                color: value === 0 ? "#3cbcb1 !important" : "white !important",
              }}
              classes={{ root: "custom-tab-root" }} // Custom class for Tab root
            />
            <Tab
              label="Latest"
              {...a11yProps(1)}
              sx={{
                color: value === 1 ? "#3cbcb1 !important" : "white !important",
              }}
              classes={{ root: "custom-tab-root" }} // Custom class for Tab root
            />
            <Tab
              label="Favorites"
              {...a11yProps(2)}
              sx={{
                color: value === 2 ? "#3cbcb1 !important" : "white !important",
              }}
              classes={{ root: "custom-tab-root" }} // Custom class for Tab root
            />
          </Tabs>
          <CustomTabPanel value={value} index={0}>
            <BlogSection blogsType={"trending"} />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <BlogSection blogsType={"latest"} />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <BlogSection blogsType={"favorites"} />
          </CustomTabPanel>
        </Box>
      </div>
    </div>
  );
};

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      className="text-white"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default Blogs;
