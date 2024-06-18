import type { MenuProps } from "antd";
import { Image, Layout } from "antd";
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const { Header, Content } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

// const menuItems: MenuProps["items"] = [
//   {
//     label: "Mother Catego

export const DashboardLayout: React.FC = () => {
  const { loginWithRedirect } = useAuth0();

  const { isLoading, isAuthenticated } = useAuth0();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      loginWithRedirect();
    }
  });

  if (isLoading || !isAuthenticated) {
    return;
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={250}
      >
        <Flex style={{ height: "64px" }} align="center" justify="center">
          <Typography.Text
            style={{ color: "white", fontWeight: "bold", fontSize: "20px" }}
          >
            {collapsed ? "U" : "PROJECT ULTRON"}
          </Typography.Text>
        </Flex>

        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
        />
      </Sider> */}
      <Layout>
        <Header
          style={{
            padding: "8px 24px",
            height: "50px",
            lineHeight: "50px",
            background: "transparent",
          }}
        >
          <Image
            preview={false}
            src="../../logo-name.png"
            style={{ height: 35, width: "auto" }}
          ></Image>
        </Header>
        <Content style={{ margin: "24px 32px" }}>
          {/* <Menu mode="horizontal" items={menuItems} /> */}
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
