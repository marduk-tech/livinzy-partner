import React, { useEffect, useState } from "react";
import { Upload, Button, message, Flex } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { baseApiUrl } from "../libs/constants";
import { COLORS } from "../styles/colors";

const MAX_IMAGE_SIZE_MB = 3;

interface ImgsUploadProps {
  imgsUploaded: (imgs: string[]) => void;
  confirmProcessing: boolean;
}

const ImgsUpload: React.FC<ImgsUploadProps> = ({
  imgsUploaded,
  confirmProcessing,
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploadPending, setUploadPending] = useState<boolean>(false);

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    const urls: string[] = [];
    setUploadPending(!!newFileList.find((file) => file.status !== "done"));
  };

  const handleProcessImages = () => {
    const urls: string[] = [];
    // Read from response and show file link
    fileList.forEach((file) => {
      if (file.response) {
        // Component will show file.url as link
        urls.push(file.response.results[0].Location);
      }
    });
    imgsUploaded(urls);
  };

  useEffect(() => {
    if (!uploadPending && !confirmProcessing && fileList && fileList.length) {
      handleProcessImages();
    }
  }, [uploadPending]);

  const beforeUpload = (file: UploadFile) => {
    const isLt3M = file.size! / 1024 / 1024 < MAX_IMAGE_SIZE_MB;
    if (!isLt3M) {
      message.error(`${file.name} is larger than ${MAX_IMAGE_SIZE_MB}MB!`);
    }
    return isLt3M;
  };

  return (
    <Flex vertical>
      <Flex
        style={{
          width: !confirmProcessing ? 160 : "auto",
          height: !confirmProcessing ? 120 : "auto",
          borderRadius: !confirmProcessing ? 16 : 0,
          border: !confirmProcessing ? "1px dashed" : 0,
          borderColor: COLORS.borderColor,
        }}
        align="center"
        justify="center"
      >
        <Upload
          fileList={fileList}
          onChange={handleChange}
          beforeUpload={beforeUpload}
          multiple
          name="images"
          action={`${baseApiUrl}upload/multiple`}
          listType={confirmProcessing ? "picture-card" : "picture"}
          showUploadList={confirmProcessing}
          accept="image/*"
        >
          <Button
            disabled={fileList.length >= 15}
            loading={uploadPending}
            style={{ border: 0, background: "none" }}
          >
            <PlusOutlined />
            <div style={{ marginTop: 8 }}> Upload</div>
          </Button>
        </Upload>
      </Flex>
      {confirmProcessing ? (
        <Button
          disabled={!fileList || !fileList.length}
          type="primary"
          onClick={handleProcessImages}
          style={{ marginTop: 32, width: 200 }}
        >
          Looks good!
        </Button>
      ) : null}
    </Flex>
  );
};

export default ImgsUpload;
