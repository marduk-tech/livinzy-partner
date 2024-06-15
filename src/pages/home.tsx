import React from "react";
import { Tabs } from "antd";
import ProjectsList from "../components/projects-list";

const { TabPane } = Tabs;

const HomePage: React.FC = () => {
  const callback = (key: string) => {
    console.log(key);
  };

  return (
    <Tabs defaultActiveKey="1" onChange={callback}>
      <TabPane tab="Projects" key="2">
        <ProjectsList></ProjectsList>
      </TabPane>
    </Tabs>
  );
};

export default HomePage;
