import React from "react";
import { Layout, Flex, Typography, Table, Tag } from "antd";
import { COLORS } from "../styles/colors";
import { useDevice } from "../libs/device";
import { useAuth0 } from "@auth0/auth0-react";
import { useGetDesignerByEmail } from "../hooks/use-designers";
import moment from "moment";

const { Content } = Layout;

interface Transaction {
  key: string;
  date: string;
  description: string;
  amount: number;
}

const WalletDetails: React.FC = () => {
  const { user } = useAuth0();
  const { data: designerData } = useGetDesignerByEmail(user?.email || "");
  const walletBalance: number = 5000; // Static wallet balance

  const transactionData: Transaction[] = [
    {
      key: "1",
      date: designerData ? designerData.createdAt! : "",
      description: "Promotional credit",
      amount: +5000,
    },
  ];
  const { isMobile } = useDevice();

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date: string) => moment(date).format("MMMM DD, YYYY"),
    },
    {
      title: "Credits",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => (
        <Tag color={amount > 0 ? "green" : "red"}>+{amount}</Tag>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
  ];

  return (
    <Flex vertical={isMobile} gap={32}>
      <Flex
        vertical
        style={{
          width: isMobile ? "100%" : 400,
          height: 200,
          borderRadius: 8,
          backgroundColor: COLORS.primaryColor,
          padding: 16,
        }}
      >
        <Typography.Text style={{ color: "white", margin: 0 }}>
          Your Wallet Credits
        </Typography.Text>
        <Typography.Title level={1} style={{ color: "white", margin: 0 }}>
          {walletBalance}
        </Typography.Title>
      </Flex>
      <Table
        dataSource={transactionData}
        columns={columns}
        style={{ width: 500 }}
        pagination={false}
        locale={{
          emptyText: "No wallet history present",
        }}
      />
    </Flex>
  );
};

export default WalletDetails;
