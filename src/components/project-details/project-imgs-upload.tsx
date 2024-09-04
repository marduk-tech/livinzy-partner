import { Button, Flex, Image, message, Typography, Upload } from "antd";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import React, { useEffect, useState } from "react";
import { baseApiUrl } from "../../libs/constants";
import { COLORS } from "../../styles/colors";

const MAX_IMAGE_SIZE_MB = 5;

interface ImgsUploadProps {
  imgsUploaded: (imgs: string[]) => void;
  confirmProcessing: boolean;
  isMultiple?: boolean;
}

/**
 * Component for uploading project images
 * @param imgsUploaded Callback function when images are uploaded
 * @param confirmProcessing Flag to indicate if confirmation processing is required
 * @param isMultiple Flag to allow multiple image uploads
 */
const ImgsUpload: React.FC<ImgsUploadProps> = ({
  imgsUploaded,
  confirmProcessing,
  isMultiple = true,
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploadPending, setUploadPending] = useState<boolean>(false);
  const [totalImagesToUpload, setTotalImagesToUpload] = useState<number>(0);

  /**
   * Handles changes in the file list
   * @param param0 Object containing the new file list
   */
  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    const urls: string[] = [];
    setUploadPending(!!newFileList.find((file) => file.status !== "done"));
  };

  /**
   * Processes uploaded images and calls the imgsUploaded callback
   */
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

  /**
   * Validates file before upload
   * @param file File to be uploaded
   * @param fileList List of files
   * @returns Boolean indicating if the file is valid for upload
   */
  const beforeUpload = (file: UploadFile, fileList: UploadFile[]) => {
    setTotalImagesToUpload(fileList.length);
    const isLt3M = file.size! / 1024 / 1024 < MAX_IMAGE_SIZE_MB;
    if (!isLt3M) {
      message.error(`${file.name} is larger than ${MAX_IMAGE_SIZE_MB}MB!`);
    }
    return isLt3M;
  };

  /**
   * Renders the upload button
   * @returns JSX for the upload button
   */
  const renderUploadBtn = () => {
    return (
      <Upload
        fileList={fileList}
        onChange={handleChange}
        beforeUpload={beforeUpload}
        multiple={isMultiple}
        maxCount={!isMultiple ? 1 : undefined}
        name="images"
        action={`${baseApiUrl}upload/multiple`}
        listType={confirmProcessing ? "picture-card" : "picture"}
        showUploadList={confirmProcessing}
        accept="image/*"
      >
        <Button
          disabled={uploadPending}
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
    <Flex
      vertical
      style={{ padding: confirmProcessing ? 32 : 0, width: "100%" }}
    >
      {confirmProcessing ? (
        <Flex style={{ width: "100%" }}>
          <Flex vertical style={{ width: "40%" }}>
            <Flex align="center" style={{ marginBottom: 16 }}>
              <Typography.Title level={3} style={{ margin: 0 }}>
                Time to upload designs!
              </Typography.Title>
              {fileList && fileList.length > 0 ? (
                <Button
                  type="primary"
                  size="small"
                  disabled={uploadPending}
                  onClick={handleProcessImages}
                  style={{ width: 125, marginLeft: "auto" }}
                >
                  All set!
                </Button>
              ) : null}
            </Flex>
            {renderUploadBtn()}
          </Flex>
          <Flex style={{ width: "60%" }} justify="center">
            <Image
              style={{ width: 500, margin: "auto" }}
              preview={false}
              src="../../upload-plcholder.png"
            ></Image>
          </Flex>
        </Flex>
      ) : (
        <Flex
          style={{
            width: 115,
            height: 85,
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
    </Flex>
  );
};

export default ImgsUpload;
