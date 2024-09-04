import {
  LogoutOutlined,
  UserOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { useAuth0 } from "@auth0/auth0-react";
import type { MenuProps } from "antd";
import { Button, Dropdown, Flex, Image, Layout, Popconfirm } from "antd";
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Loader } from "../components/common/loader";
import { useUser } from "../hooks/use-user";
import { COLORS } from "../styles/colors";

const { Header, Content } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

/**
 * Creates a menu item object
 * @param {React.ReactNode} label - The label for the menu item
 * @param {React.Key} key - The key for the menu item
 * @param {React.ReactNode} icon - The icon for the menu item
 * @param {MenuItem[]} children - The child menu items
 * @returns {MenuItem} The created menu item object
 */
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

/**
 * Dashboard layout component
 * @returns {JSX.Element} The rendered dashboard layout
 */
export const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth0();
  const { user, isLoading, isError } = useUser();

  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (isError) {
    navigate("/");
    return <></>;
  }

  if (user) {
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
              height: 48,
              padding: "12px",
              marginBottom: 16,
              background: "transparent",
            }}
          >
            <Flex align="center" style={{ height: 48, paddingLeft: 16 }}>
              <Image
                preview={false}
                onClick={() => {
                  navigate("/");
                }}
                src="../../logo-studio.png"
                style={{
                  height: "36px",
                  width: "auto",
                  cursor: "pointer",
                }}
              ></Image>

              <Dropdown
                menu={{
                  items: [
                    {
                      key: "1",
                      label: (
                        <Button
                          icon={<UserOutlined />}
                          style={{
                            color: COLORS.textColorDark,
                            padding: 0,
                            height: 32,
                            width: 150,
                            textAlign: "left",
                          }}
                          type="link"
                          onClick={() => {
                            navigate("/account");
                          }}
                        >
                          Account
                        </Button>
                      ),
                    },
                    {
                      key: "2",
                      label: (
                        <Button
                          icon={<WalletOutlined />}
                          style={{
                            color: COLORS.textColorDark,
                            padding: 0,
                            height: 32,
                            width: 150,
                            textAlign: "left",
                          }}
                          type="link"
                          onClick={() => {
                            navigate("/wallet");
                          }}
                        >
                          Wallet
                        </Button>
                      ),
                    },
                    {
                      key: "3",
                      label: (
                        <Popconfirm
                          title="Logout"
                          description="Are you sure you want to logout ?"
                          onConfirm={() => {
                            logout({
                              logoutParams: {
                                returnTo: window.location.origin,
                              },
                            });
                          }}
                          okText="Yes"
                          cancelText="No"
                          okButtonProps={{
                            type: "link",
                          }}
                          cancelButtonProps={{
                            type: "link",
                          }}
                        >
                          <Button
                            icon={<LogoutOutlined />}
                            style={{
                              color: COLORS.textColorDark,
                              padding: 0,
                              height: 32,
                              width: 150,
                              textAlign: "left",
                            }}
                            type="link"
                          >
                            Logout
                          </Button>
                        </Popconfirm>
                      ),
                    },
                  ],
                }}
                placement="bottomRight"
              >
                <Button
                  shape="circle"
                  size="small"
                  icon={<UserOutlined />}
                  style={{
                    marginRight: 16,
                    marginLeft: "auto",
                  }}
                ></Button>
              </Dropdown>
            </Flex>
          </Header>
          <Content style={{ margin: "24px 32px" }}>
            {/* <Menu mode="horizontal" items={menuItems} /> */}
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    );
  }
};
