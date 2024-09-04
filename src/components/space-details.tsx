import { UngroupOutlined } from "@ant-design/icons";
import {
  Button,
  Collapse,
  Flex,
  Form,
  Input,
  message,
  Modal,
  Select,
  Spin,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useEffect, useState } from "react";
import { useGenerateOneLiner } from "../hooks/use-ai";
import { getSpaceMeta } from "../hooks/use-meta";
import { useSaveSpace } from "../hooks/use-spaces";
import { SpaceMeta } from "../interfaces/Meta";
import { Slide } from "../interfaces/Slide";
import { Space } from "../interfaces/Space";
import { convertFeetToInch } from "../libs/lvnzy-helper";
import { queryKeys } from "../libs/react-query/constants";
import { queryClient } from "../libs/react-query/query-client";

/**
 * SpaceDetails component for displaying and editing space information
 */
const SpaceDetails: React.FC<{
  spaceData: Space;
  projectId: string;
  showSpaceDialog: boolean;
  spaceDialogClosed: any;
  slide?: Slide;
}> = ({ spaceData, projectId, showSpaceDialog, spaceDialogClosed, slide }) => {
  const { data: spaceMetaData, isPending: spaceMetaDataPending } =
    getSpaceMeta();

  const saveSpaceMutation = useSaveSpace();
  const [currentSpace, setCurrentSpace] = useState<Space>();
  const [form] = Form.useForm();

  const generateOneLinerMutation = useGenerateOneLiner();

  useEffect(() => {
    console.log(projectId);
    if (!spaceData) {
      return;
    }
    form.setFieldsValue({
      ...spaceData,
      spaceType: spaceData.spaceType._id,
    });
  }, [showSpaceDialog, spaceData]);

  /**
   * Handles dialog cancellation
   */
  const handleCancel = () => {
    form.resetFields();
    spaceDialogClosed();
  };

  /**
   * Handles space type change
   * @param value - The selected space type value
   */
  const onChangeSpaceType = (value: string) => {
    const spaceType = spaceMetaData.find((s: SpaceMeta) => s._id == value);
    form.setFieldsValue({
      name: spaceType.spaceType,
    });
  };

  /**
   * Handles form submission
   * @param updatedSpaceData - The updated space data
   */
  const handleFinish = (updatedSpaceData: Space) => {
    updatedSpaceData.projectId = projectId;
    if (updatedSpaceData.size) {
      updatedSpaceData.size.l = updatedSpaceData.size.l
        ? convertFeetToInch(updatedSpaceData.size.l)
        : updatedSpaceData.size.l;
      updatedSpaceData.size.w = updatedSpaceData.size.w
        ? convertFeetToInch(updatedSpaceData.size.w)
        : updatedSpaceData.size.w;
    }
    saveSpaceMutation.mutate(
      { ...spaceData, ...updatedSpaceData },
      {
        onSuccess: async () => {
          message.success("Space saved successfully!");
          await queryClient.invalidateQueries({
            queryKey: [queryKeys.getSpaces],
          });
          spaceDialogClosed();
        },
        onError: () => {
          message.error("Failed to save project.");
        },
      }
    );
  };

  /**
   * Generates a one-liner description for the space
   * @param designName - The name of the design
   */
  const onClickGenerateOneLiner = async (designName: string) => {
    await generateOneLinerMutation.mutateAsync(
      {
        designName: designName,
        projectId: projectId as string,
        spaceId: spaceData ? spaceData._id : undefined,
        slideId: spaceData ? undefined : slide?._id,
      },
      {
        onSuccess: (response: any) => {
          form.setFieldsValue({
            oneLiner: response,
          });
        },
        onError: () => {
          message.error("Could not generate description");
        },
      }
    );
  };

  return (
    <>
      <Modal
        afterClose={() => {
          form.resetFields();
        }}
        title={spaceData && spaceData._id ? "Edit Space" : "Add Space"}
        open={showSpaceDialog}
        onCancel={handleCancel}
        footer={null}
        width={700}
      >
        <Form form={form} onFinish={handleFinish} layout="vertical">
          <Form.Item noStyle shouldUpdate>
            {({ getFieldValue }) => {
              return (
                <>
                  <Form.Item
                    name="spaceType"
                    label="Type"
                    rules={[
                      { required: true, message: "Please input the type!" },
                    ]}
                  >
                    {spaceMetaDataPending ? (
                      <Spin />
                    ) : (
                      <Select
                        showSearch
                        placeholder="Select the space"
                        filterOption={(input, option) =>
                          (`${option?.label}` || "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        onChange={onChangeSpaceType}
                        options={spaceMetaData.map((spaceMeta: SpaceMeta) => {
                          return {
                            value: spaceMeta._id,
                            label: spaceMeta.spaceType,
                          };
                        })}
                      ></Select>
                    )}
                  </Form.Item>
                  <Form.Item
                    name="name"
                    label="Unique name for the space"
                    rules={[
                      { required: true, message: "Please input the name" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item name="cost" label="Cost">
                    <Input type="number" />
                  </Form.Item>
                  <Collapse
                    items={[
                      {
                        key: "1",
                        label: "More options",
                        children: (
                          <>
                            <Flex gap={8}>
                              <Form.Item
                                name={["size", "l"]}
                                label="Length in Feet (Optional)"
                              >
                                <Input type="number" width={25} />
                              </Form.Item>
                              <Form.Item
                                name={["size", "w"]}
                                label="Width in Feet (Optional)"
                              >
                                <Input type="number" width={25} />
                              </Form.Item>
                            </Flex>
                            <Form.Item
                              name="oneLiner"
                              label="One liner description (400 characters or less)"
                            >
                              <TextArea
                                rows={5}
                                maxLength={400}
                                style={{ fontSize: "110%" }}
                              />
                            </Form.Item>
                            <Button
                              disabled={!getFieldValue("name")}
                              icon={<UngroupOutlined />}
                              type="link"
                              style={{
                                padding: 0,
                                textAlign: "left",
                                marginTop: 5,
                              }}
                              onClick={() =>
                                onClickGenerateOneLiner(getFieldValue("name"))
                              }
                              loading={generateOneLinerMutation.isPending}
                            >
                              {generateOneLinerMutation.isPending
                                ? "Generating description from designs.."
                                : "AI Generate"}
                            </Button>
                          </>
                        ),
                      },
                    ]}
                  />

                  <Form.Item>
                    <Button
                      loading={saveSpaceMutation.isPending}
                      type="primary"
                      htmlType="submit"
                      style={{ marginTop: 32 }}
                    >
                      {spaceData && spaceData._id ? "Update" : "Add"}
                    </Button>
                  </Form.Item>
                </>
              );
            }}
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default SpaceDetails;
