import React, { useState } from "react";
import { Tabs } from "antd";
import ProjectsList from "../components/projects-list";

const { TabPane } = Tabs;

const HomePage: React.FC = () => {
  const callback = (key: string) => {
    console.log(key);
  };
  const [projectListKey, setProjectListKey] = useState(0);

  // Hack to reset the tab to list view on click of the tab
  const onTabClick = (key: string) => {
    if (key == "1") {
      setProjectListKey(projectListKey + 1);
    }
  };

  return <ProjectsList key={projectListKey}></ProjectsList>;
};

export default HomePage;
