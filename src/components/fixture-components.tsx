import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Flex, message, Table, TableColumnType } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useFetchFixturesByProject,
  useSaveFixture,
} from "../hooks/use-fixtures";
import { Fixture, FixtureComponent } from "../interfaces/Fixture";
import { useDevice } from "../libs/device";
import { queryKeys } from "../libs/react-query/constants";
import { queryClient } from "../libs/react-query/query-client";
import { ColumnSearch } from "./common/column-search";
import { DeletePopconfirm } from "./delete-popconfirm";
import { EditFixtureComponents } from "./edit-fixture-components";

interface FixtureComponentsProps {
  fixture: Fixture;
}

export const FixtureComponents: React.FC<FixtureComponentsProps> = ({
  fixture,
}) => {
  const { isMobile } = useDevice();
  const [openEditFixture, setEditFixture] = useState(false);
  const [selectedFixtureComponent, setSelectedFixtureComponent] = useState<
    FixtureComponent | undefined
  >();
  const saveFixtureMutation = useSaveFixture();
  const { projectId } = useParams();
  const [selectedFixture, setSelectedFixture] = useState<Fixture>(fixture);

  const {
    data: projectFixtures,
    isPending: fixturesDataPending,
    refetch: refetchProjectFixtures,
  } = useFetchFixturesByProject(projectId as string);

  useEffect(() => {
    const selectedFixture = projectFixtures.find(
      (f: Fixture) => f._id === fixture._id
    );

    setSelectedFixture(selectedFixture);
  }, [projectFixtures, openEditFixture]);

  const updateFixtureComponent = async ({
    fixtureComponent,
    action,
  }: {
    fixtureComponent: FixtureComponent;
    action: "ADD" | "UPDATE" | "DELETE";
  }) => {
    const existingFixtureComponents = selectedFixture.components;

    let fixtureComponents = existingFixtureComponents;

    if (action === "UPDATE") {
      // Edit action: find and update the existing component
      fixtureComponents = existingFixtureComponents.map((component) =>
        component._id === fixtureComponent._id ? fixtureComponent : component
      );
    }

    if (action === "ADD") {
      // Add action: append the new component
      fixtureComponents = [...existingFixtureComponents, fixtureComponent];
    }

    if (action === "DELETE") {
      // Delete action: filter out the component to be deleted
      fixtureComponents = existingFixtureComponents.filter(
        (component) => component._id !== fixtureComponent._id
      );
    }

    const postData = {
      _id: fixture._id,
      components: fixtureComponents,
    };

    await saveFixtureMutation.mutateAsync(postData, {
      onSuccess: (response: any) => {},
      onError: (err) => {
        message.error("Failed to save project.");
      },
    });

    await queryClient.invalidateQueries({
      queryKey: [queryKeys.getFixtures, projectId],
    });

    setEditFixture(false);
    setSelectedFixtureComponent(undefined);
  };

  const columns: TableColumnType<FixtureComponent>[] = [
    {
      title: "Name",
      dataIndex: "originalName",
      key: "originalName",
      ...ColumnSearch("originalName"),
    },

    {
      title: "Work Type",
      dataIndex: "workType",
      key: "workType",
      ...ColumnSearch("workType"),
    },

    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
      ...ColumnSearch("brand"),
    },

    {
      title: "Material",
      dataIndex: "material",
      key: "material",
      ...ColumnSearch("material"),
    },

    {
      title: "Cost",
      dataIndex: "cost",
      key: "cost",
      ...ColumnSearch("cost"),
    },

    {
      title: "",
      align: "right",
      dataIndex: "_id",
      key: "_id",

      render: (id: string, record) => {
        const fixture = selectedFixture.components.find(
          (component) => component._id === id
        );

        return (
          <Flex gap={isMobile ? 5 : 15} justify="end">
            <Button
              type="primary"
              size="small"
              onClick={() => {
                setSelectedFixtureComponent(fixture);
                setEditFixture(true);
              }}
              icon={<EditOutlined />}
            ></Button>

            <DeletePopconfirm
              handleOk={() =>
                updateFixtureComponent({
                  fixtureComponent: fixture as FixtureComponent,
                  action: "DELETE",
                })
              }
              isLoading={false}
              title="Delete"
              description="Are you sure you want to delete this component"
            >
              <Button
                type="default"
                shape="default"
                icon={<DeleteOutlined />}
                size="small"
              ></Button>
            </DeletePopconfirm>
          </Flex>
        );
      },
    },
  ];

  return (
    <>
      <Table
        bordered
        dataSource={selectedFixture?.components}
        columns={columns}
        rowKey="_id"
        pagination={false}
      />

      <Button
        style={{ marginTop: 20 }}
        type="primary"
        size="small"
        onClick={() => {
          setSelectedFixtureComponent(undefined);
          setEditFixture(true);
        }}
      >
        Add
      </Button>

      {/* Modals */}
      <EditFixtureComponents
        component={selectedFixtureComponent}
        open={openEditFixture}
        setOpen={setEditFixture}
        updateFixture={updateFixtureComponent}
        confirmLoading={false}
      />
    </>
  );
};
