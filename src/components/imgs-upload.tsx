import React, { useEffect, useState } from "react";
import { Upload, Button, message, Flex, Typography, Image } from "antd";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { baseApiUrl } from "../libs/constants";
import { COLORS } from "../styles/colors";

const MAX_IMAGE_SIZE_MB = 5;

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
  const [totalImagesToUpload, setTotalImagesToUpload] = useState<number>(0);

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

  const beforeUpload = (file: UploadFile, fileList: UploadFile[]) => {
    setTotalImagesToUpload(fileList.length);
    const isLt3M = file.size! / 1024 / 1024 < MAX_IMAGE_SIZE_MB;
    if (!isLt3M) {
      message.error(`${file.name} is larger than ${MAX_IMAGE_SIZE_MB}MB!`);
    }
    return isLt3M;
  };

  const renderUploadBtn = () => {
    return (
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
          type="link"
          style={{ border: 0, color: COLORS.primaryColor, fontSize: 18 }}
        >
          <div style={{ marginTop: 0 }}>+Upload</div>
        </Button>
      </Upload>
    );
  };

  return (
    <Flex vertical style={{ padding: confirmProcessing ? 32 : 0 }}>
      {confirmProcessing ? (
        <Flex vertical>
          <Image
            style={{ width: 200 }}
            preview={false}
            src="../../designs-swatch-icon.jpeg"
          ></Image>
          <Typography.Title level={2} style={{ margin: 0, marginBottom: 16 }}>
            Its time to upload your designs!
          </Typography.Title>
          {renderUploadBtn()}
        </Flex>
      ) : (
        <Flex
          style={{
            width: 100,
            height: 80,
            borderRadius: !confirmProcessing ? 16 : 0,
            border: !confirmProcessing ? "2px dashed" : 0,
            borderColor: COLORS.borderColor,
          }}
          align="center"
          justify="center"
        >
          {renderUploadBtn()}
        </Flex>
      )}

      {confirmProcessing &&
      fileList &&
      fileList.length > 0 &&
      fileList.length == totalImagesToUpload ? (
        <Button
          type="primary"
          onClick={handleProcessImages}
          style={{ marginTop: 32, width: 200 }}
        >
          All set!
        </Button>
      ) : null}
    </Flex>
  );
};

export default ImgsUpload;
