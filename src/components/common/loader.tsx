import { Flex, Spin, SpinProps } from "antd";

export interface LoaderProps extends SpinProps {}

/**
 * Component for displaying a loading spinner
 * @param size Size of the spinner
 * @param props Additional props for the Spin component
 */
export function Loader({ size = "large", ...props }: LoaderProps) {
  return (
    <Flex align="center" justify="center" style={{ height: "200px" }}>
      <Spin size={size} {...props} />
    </Flex>
  );
}
