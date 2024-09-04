import { Alert, Card, Col, Flex, Row, Typography, message } from "antd";
import Meta from "antd/es/card/Meta";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useFetchProjectsByDesigner } from "../hooks/use-projects";
import { useUser } from "../hooks/use-user";
import { Project } from "../interfaces/Project";
import { useDevice } from "../libs/device";
import { Loader } from "./common/loader";

/**
 * ProjectsList component for displaying a list of projects
 */
const ProjectsList: React.FC = () => {
  const { user } = useUser();

  const { data: projects, isLoading } = useFetchProjectsByDesigner(user._id);
  const { isMobile } = useDevice();

  const navigate = useNavigate();

  if (isLoading) {
    return <Loader />;
  }

  if (projects) {
    return (
      <Flex
        justify="center"
        style={{
          width: "100%",
          marginTop: 16,
          padding: `16px ${isMobile ? "20px" : "40px"}`,
        }}
      >
        <Row gutter={[24, 24]} style={{ width: "1200px" }}>
          <Col key="new" xs={24} md={12} lg={6}>
            {!isMobile ? (
              <Card
                style={{ width: isMobile ? "100%" : 240, height: 275 }}
                hoverable
                cover={
                  <div
                    style={{
                      cursor: "pointer",
                      borderTopLeftRadius: 12,
                      borderTopRightRadius: 12,
                      width: isMobile ? "100%" : 240,
                      height: 180,
                      backgroundImage: `url(${"../../new-design.png"})`,
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                    }}
                  />
                }
                onClick={() => {
                  navigate(`/projects/new`);
                }}
              >
                <Meta
                  title={
                    <Typography.Title
                      level={4}
                      style={{ padding: 0, margin: 0 }}
                    >
                      Upload New
                    </Typography.Title>
                  }
                />
              </Card>
            ) : (
              <Alert
                message="Use desktop browser to add or edit designs"
                style={{ width: "100%" }}
                type="warning"
                showIcon
              />
            )}
          </Col>

          {projects
            .filter((project: Project) => !project.archived)
            .map((project: Project) => (
              <Col key={project._id} xs={24} md={12} lg={6}>
                <Card
                  hoverable
                  onClick={() => {
                    if (isMobile) {
                      message.warning(
                        "You can only add or edit designs using desktop"
                      );
                      return;
                    }
                    if (project.homeDetails && project.homeDetails.homeType) {
                      navigate(`/projects/details/${project._id}`);
                    } else {
                      navigate(`/projects/new/${project._id}`);
                    }
                  }}
                  style={{
                    width: isMobile ? "100%" : 240,
                    borderRadius: 16,
                    height: 275,
                  }}
                  cover={
                    <div
                      style={{
                        cursor: "pointer",
                        borderTopLeftRadius: 12,
                        borderTopRightRadius: 12,
                        width: isMobile ? "100%" : 240,
                        height: 180,
                        backgroundImage: `url(${
                          project.previewImageUrl || "../../img-plchlder.png"
                        })`,
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                      }}
                    />
                  }
                >
                  <Meta
                    title={
                      <Flex vertical>
                        <Typography.Title
                          level={4}
                          style={{ padding: 0, margin: 0 }}
                        >
                          {project.name}
                        </Typography.Title>
                        {project.homeDetails ? (
                          <Flex>
                            <Typography.Text>
                              {project.homeDetails.homeType.homeType}
                            </Typography.Text>
                            {project.homeDetails.size ? (
                              <Typography.Text>
                                , {project.homeDetails.size} sqft
                              </Typography.Text>
                            ) : null}
                          </Flex>
                        ) : null}
                      </Flex>
                    }
                  />
                </Card>
              </Col>
            ))}
        </Row>
      </Flex>
    );
  }
  return null;
};

export default ProjectsList;
