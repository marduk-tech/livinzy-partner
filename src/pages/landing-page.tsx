import { Button, Flex, Image, Typography } from "antd";
import React from "react";
import { useDevice } from "../libs/device";
import { useAuth0 } from "@auth0/auth0-react";

const LandingPage: React.FC = () => {
  const { isMobile } = useDevice();
  const { loginWithRedirect } = useAuth0();

  return (
    <Flex
      vertical={isMobile}
      style={{
        color: "white",
        borderRadius: 16,
        width: isMobile ? "100%" : "90%",
        margin: "auto",
        padding: "32px",
        backgroundImage: `url(${"../../landing-bg.png"})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Flex
        vertical
        style={{
          justifyContent: "center",
          padding: isMobile ? 0 : 48,
          paddingLeft: 0,
        }}
      >
        <Typography.Text
          style={{
            width: "100%",
            color: "white",
            fontSize: isMobile ? 24 : 48,
            fontWeight: 900,
          }}
        >
          Wow Your Customers
        </Typography.Text>
        <Typography.Text
          style={{
            color: "white",
            width: "100%",
            fontSize: 24,
          }}
        >
          Bring your interior designs to life with Livinzy Studio.<br></br>
          Offer an amazing experience and get higher conversion.
        </Typography.Text>
        <Button
          type="primary"
          style={{ width: 240, marginTop: 32 }}
          onClick={() => {
            loginWithRedirect();
          }}
        >
          Login Now
        </Button>
      </Flex>
      <Flex
        style={{
          marginTop: isMobile ? 24 : 0,
          width: isMobile ? "100%" : 500,
          borderRadius: 24,
          alignItems: "center",
        }}
      >
        <Image src="../../landing-mock.png" preview={false}></Image>
      </Flex>
    </Flex>
  );
};

export default LandingPage;
