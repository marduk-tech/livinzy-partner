import { Alert, Card, Flex, Typography, message } from "antd";
import Meta from "antd/es/card/Meta";
import React from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useFetchProjectsByDesigner } from "../hooks/use-projects";
import { Project } from "../interfaces/Project";
import { useDevice } from "../libs/device";
import { cookieKeys } from "../libs/react-query/constants";

const ProjectsList: React.FC = () => {
  const [cookies, setCookie, removeCookie] = useCookies([cookieKeys.userId]);

  const { data: projects, isLoading } = useFetchProjectsByDesigner(
    cookies[cookieKeys.userId]
  );
  const { isMobile } = useDevice();

  const navigate = useNavigate();

  if (!cookies || !cookies[cookieKeys.userId]) {
    return;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <Flex style={{ width: "100%", flexWrap: "wrap" }} gap={32}>
      {!isMobile ? (
        <Card
          style={{ width: isMobile ? "100%" : 240 }}
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
            navigate(`/projects/details/new`);
          }}
        >
          <Meta
            title={
              <Typography.Title level={4} style={{ padding: 0, margin: 0 }}>
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

      {projects?.map((project: Project) => (
        <Card
          hoverable
          onClick={() => {
            if (isMobile) {
              message.warning("You can only add or edit designs using desktop");
              return;
            }
            navigate(`/projects/details/${project._id}`);
          }}
          style={{ width: isMobile ? "100%" : 240, borderRadius: 16 }}
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
                <Typography.Title level={4} style={{ padding: 0, margin: 0 }}>
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
      ))}
    </Flex>
  );
};

export default ProjectsList;
