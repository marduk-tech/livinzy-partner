import React, { useState } from "react";
import { Tabs } from "antd";
import ProjectsList from "../components/projects-list";
import AccountDetails from "../components/account-details";

const { TabPane } = Tabs;

const HomePage: React.FC = () => {
  const callback = (key: string) => {
    console.log(key);
  };
  const [projectListKey, setProjectListKey] = useState(0);

  // Hack to reset the tab to list view on click of the tab
  const onTabClick = (key: string) => {
    if (key == "2") {
      setProjectListKey(projectListKey+1);
    }
  }

  return (
    <Tabs defaultActiveKey="1" onChange={callback} onTabClick={onTabClick}>
      <TabPane tab="Account" key="1">
        <AccountDetails></AccountDetails>
      </TabPane>
      <TabPane tab="Projects" key="2" >
        <ProjectsList key={projectListKey}></ProjectsList>
      </TabPane>
    </Tabs>
  );
};

export default HomePage;
