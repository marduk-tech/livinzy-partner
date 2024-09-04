import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space } from "antd";
import { FilterDropdownProps } from "antd/es/table/interface";
import { nestedPropertyAccessor } from "../../libs/lvnzy-helper";

/**
 * Resets the filter, clears selected keys, and confirms the change
 * @param clearFilters Function to clear filters
 * @param setSelectedKeys Function to set selected keys
 * @param confirm Function to confirm changes
 */
export const handleReset = (
  clearFilters: () => void,
  setSelectedKeys: (arr: any) => void,
  confirm: () => void
) => {
  clearFilters();
  setSelectedKeys([]);
  confirm();
};

/**
 * Creates a column search configuration for Ant Design Table
 * @param dataIndex The data index to search on
 * @returns An object with filter dropdown, icon, and filter function
 */
export const ColumnSearch = (dataIndex: any) => ({
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
    close,
  }: FilterDropdownProps) => {
    return (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          placeholder={`Search`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => confirm()}
          style={{ marginBottom: 8, display: "block" }}
        />

        <Space>
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            style={{ width: "100%" }}
            size="middle"
          >
            Search
          </Button>

          <Button
            onClick={() =>
              clearFilters &&
              handleReset(clearFilters, setSelectedKeys, confirm)
            }
            style={{ width: "100%" }}
            size="middle"
          >
            Reset
          </Button>
        </Space>
      </div>
    );
  },
  filterIcon: (filtered: any) => (
    <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
  ),
  onFilter: (value: any, record: any) => {
    const nestedValue = nestedPropertyAccessor(record, dataIndex);
    if (nestedValue === undefined) return false;
    return nestedValue
      .toString()
      .toLowerCase()
      .includes((value as string).toLowerCase());
  },
});
