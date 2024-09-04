import { Flex, Radio } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import React, { useState } from "react";

interface MobileFrameProps {
  url: string;
}

/**
 * Component for displaying content in a mobile frame
 * @param url URL of the content to display
 */
const MobileFrame: React.FC<MobileFrameProps> = ({ url }) => {
  const [device, setDevice] = useState<string>("mobile");
  return (
    <Flex vertical align="center">
      <Flex>
        <Radio.Group
          defaultValue={device}
          buttonStyle="solid"
          onChange={(e: CheckboxChangeEvent) => {
            setDevice(e.target.value);
          }}
        >
          <Radio.Button value="mobile">Mobile</Radio.Button>
          <Radio.Button value="desktop">Desktop</Radio.Button>
        </Radio.Group>
      </Flex>
      <div
        style={{
          width:
            device == "mobile"
              ? "275px"
              : "750px" /* Width of the mobile phone */,
          height:
            device == "mobile"
              ? "625px"
              : "525px" /* Height of the mobile phone */,
          backgroundColor: "#fff",
          borderRadius: "36px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
          position: "relative",
          border: "16px solid #000",
          marginTop: "16px",
          marginRight: 24,
        }}
      >
        <div
          className="phone-header"
          style={{
            height: 20 /* Height of the top header */,
            backgroundColor: "#000",
            borderBottom: "2px solid #333",
          }}
        ></div>
        <iframe
          style={{
            width: "154%",
            height:
              "calc(154% - 30.7px)" /* Adjust height to fit within the frame */,
            border: "none",
            transform: "scale(0.65)",
            transformOrigin: "top left",
          }}
          src={url}
          title="Mobile Frame"
        ></iframe>
      </div>
    </Flex>
  );
};

export default MobileFrame;
