import React, { useEffect, useState } from "react";
import { Form, Input, Button, Upload, message, Avatar, Spin, Flex } from "antd";
import ImgCrop from "antd-img-crop";
import { UploadFile, UploadChangeParam } from "antd/lib/upload/interface";
import { UserOutlined } from "@ant-design/icons";
import { useGetDesignerByEmail, useSaveDesigner } from "../hooks/use-designers";
import { Designer } from "../interfaces/Designer";
import { useAuth0 } from "@auth0/auth0-react";
import { baseApiUrl } from "../libs/constants";
import { useDevice } from "../libs/device";

const { TextArea } = Input;

const INPUT_WIDTH = 400;

const AccountDetails: React.FC = () => {
  const { user } = useAuth0();

  if (!user || !user.email) {
    return;
  }

  const { isMobile } = useDevice();

  const [form] = Form.useForm();
  const { data, isLoading } = useGetDesignerByEmail(user?.email || "");
  const saveDesignerMutation = useSaveDesigner();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const [isFormChanged, setIsFormChanged] = useState(false);

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);

      if (data.profilePicture) {
        setFileList([
          {
            url: data.profilePicture,
            name: "Profile Picture",
            status: "done",
          } as UploadFile,
        ]);
      }
    }
  }, [data, form]);

  const handleFinish = (designerData: Designer) => {
    // Append profilePicture URL if exists
    if (fileList.length > 0 && fileList[0].response) {
      designerData.profilePicture = fileList[0].url;
    }
    designerData.email = user.email;

    saveDesignerMutation.mutate(designerData, {
      onSuccess: () => {
        message.success("Profile saved successfully!");
      },
      onError: () => {
        message.error("Failed to save profile.");
      },
    });
  };

  const handleFormChange = () => {
    setIsFormChanged(true); // Indicate form has changed
  };

  const handleUploadChange = (info: UploadChangeParam<UploadFile>) => {
    let newFileList = [...info.fileList];

    // Limit the number of uploaded files to 1
    newFileList = newFileList.slice(-1);

    // Read from response and show file link
    newFileList = newFileList.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.data.Location;
      }
      return file;
    });

    setFileList(newFileList);
    setIsFormChanged(true);
  };

  if (isLoading) {
    return <Spin />;
  }

  return (
    <Flex
      vertical
      style={{ backgroundColor: "white", borderRadius: 8, padding: 32 }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        onValuesChange={handleFormChange}
      >
        <Flex gap={24} align="center">
          <Form.Item>
            <Avatar
              size={100}
              style={{ marginRight: 32 }}
              icon={<UserOutlined />}
              src={
                fileList.length > 0 && fileList[0].url
                  ? fileList[0].url
                  : undefined
              }
            />
            <ImgCrop rotationSlider>
              <Upload
                action={`${baseApiUrl}upload/single`}
                name="image"
                listType="picture"
                fileList={fileList}
                onChange={handleUploadChange}
                showUploadList={false}
              >
                <Button>Change picture</Button>
              </Upload>
            </ImgCrop>
          </Form.Item>
        </Flex>
        <Flex vertical={isMobile} style={{ marginBottom: 32 }}>
          <Flex vertical style={{ marginRight: isMobile ? 0 : 32 }}>
            <Form.Item
              name="designerName"
              label="Your name or company name"
              rules={[{ required: true, message: "Please enter your name" }]}
            >
              <Input style={{ width: isMobile ? "100%" : INPUT_WIDTH }} />
            </Form.Item>
            <Form.Item
              name="numYearsExperience"
              label="Your experience in years"
            >
              <Input
                type="number"
                style={{ width: isMobile ? "100%" : INPUT_WIDTH }}
              />
            </Form.Item>
            <Form.Item name="numProjects" label="Projects you have completed">
              <Input
                type="number"
                style={{ width: isMobile ? "100%" : INPUT_WIDTH }}
              />
            </Form.Item>
            <Form.Item
              name="bio"
              label="Describe your experience & how you are unique"
            >
              <TextArea
                rows={4}
                style={{ width: isMobile ? "100%" : INPUT_WIDTH }}
              />
            </Form.Item>
          </Flex>
          <Flex vertical>
            <Form.Item
              name="email"
              label="Your Email"
              initialValue={user.email}
              rules={[{ required: true, message: "Please enter your name" }]}
            >
              <Input
                disabled
                style={{ width: isMobile ? "100%" : INPUT_WIDTH }}
              />
            </Form.Item>

            <Form.Item
              name="mobile"
              label="Your mobile"
              rules={[{ required: true, message: "Please enter your name" }]}
            >
              <Input style={{ width: isMobile ? "100%" : INPUT_WIDTH }} />
            </Form.Item>

            <Form.Item name="address" label="Your address">
              <Input style={{ width: isMobile ? "100%" : INPUT_WIDTH }} />
            </Form.Item>
          </Flex>
        </Flex>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={saveDesignerMutation.isPending}
            disabled={!isFormChanged}
          >
            Save changes
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
};

export default AccountDetails;
