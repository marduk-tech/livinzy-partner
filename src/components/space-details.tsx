import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Modal,
  Flex,
  message,
  Spin,
  Select,
  Collapse,
} from "antd";
import { Space } from "../interfaces/Space";
import { getSpaceMeta } from "../hooks/use-meta";
import { useSaveSpace } from "../hooks/use-spaces";
import { SpaceMeta } from "../interfaces/Meta";
import { queryClient } from "../libs/react-query/query-client";
import { queryKeys } from "../libs/react-query/constants";
import TextArea from "antd/es/input/TextArea";
import { convertFeetToInch } from "../libs/lvnzy-helper";

const SpaceDetails: React.FC<{
  spaceData: Space;
  projectId: string;
  showSpaceDialog: boolean;
  spaceDialogClosed: any;
}> = ({ spaceData, projectId, showSpaceDialog, spaceDialogClosed }) => {
  const { data: spaceMetaData, isPending: spaceMetaDataPending } =
    getSpaceMeta();

  const saveSpaceMutation = useSaveSpace();
  const [currentSpace, setCurrentSpace] = useState<Space>();
  const [form] = Form.useForm();

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

  const handleCancel = () => {
    form.resetFields();
    spaceDialogClosed();
  };

  const onChangeSpaceType = (value: string) => {
    const spaceType = spaceMetaData.find((s: SpaceMeta) => s._id == value);
    form.setFieldsValue({
      name: spaceType.spaceType,
    });
  };
  /**
   * When form is submitted.
   * @param updatedSpaceData
   */
  const handleFinish = (updatedSpaceData: Space) => {
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

  return (
    <>
      <Modal
        title={spaceData && spaceData._id ? "Edit Space" : "Add Space"}
        open={showSpaceDialog}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleFinish} layout="vertical">
          <Form.Item
            name="spaceType"
            label="Type"
            rules={[{ required: true, message: "Please input the type!" }]}
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
            rules={[{ required: true, message: "Please input the name" }]}
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
                      <Form.Item name={["size", "l"]} label="Length (Optional)">
                        <Input type="number" width={25} />
                      </Form.Item>
                      <Form.Item name={["size", "w"]} label="Width (Optional)">
                        <Input type="number" width={25} />
                      </Form.Item>
                    </Flex>
                    <Form.Item
                      name="oneLiner"
                      label="One liner about this space"
                    >
                      <TextArea rows={2} />
                    </Form.Item>
                  </>
                ),
              },
            ]}
          />

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginTop: 32 }}>
              {spaceData && spaceData._id ? "Update" : "Add"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default SpaceDetails;
