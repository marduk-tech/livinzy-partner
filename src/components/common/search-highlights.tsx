import { Flex, Form, Select, Tag } from "antd";
import debounce from "lodash.debounce";
import React, { useEffect, useState } from "react";
import { useSearchFixtureHighlights } from "../../hooks/use-fixtures";

const { Option } = Select;

interface SearchHighlightsProps {
  label: string;
  fixtureType: string;
  onChange: (values: string[]) => void;
}

/**
 * Component for searching and selecting highlights
 * @param label Label for the search input
 * @param fixtureType Type of fixture to search
 * @param onChange Function to call when selection changes
 */
const SearchHighlights: React.FC<SearchHighlightsProps> = ({
  label,
  fixtureType,
  onChange,
}) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [options, setOptions] = useState<string[]>([]);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const searchHighlightsMutation = useSearchFixtureHighlights();

  const debouncedSearch = debounce((value: string) => {
    if (value) {
      searchHighlightsMutation.mutate(
        { searchKeyword: value, fixtureType },
        {
          onSuccess: async (response: any) => {
            setOptions(response.map((h: any) => h.name));
          },
          onError: () => {},
        }
      );
    } else {
      setOptions([]);
    }
  }, 1000);

  useEffect(() => {
    debouncedSearch(searchValue);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchValue]);

  /**
   * Handles search input change
   * @param value Search input value
   */
  const handleSearch = (value: string) => {
    if (value && value.length >= 3) {
      setSearchValue(value);
    }
  };

  /**
   * Handles selection of a highlight
   * @param value Selected highlight value
   */
  const handleSelect = (value: string) => {
    const newSelectedValues = [...selectedValues, value];
    setSelectedValues(newSelectedValues);
    onChange(newSelectedValues); // Call the onChange callback
  };

  /**
   * Handles removal of a selected highlight
   * @param value Highlight value to remove
   */
  const handleTagClose = (value: string) => {
    const newSelectedValues = selectedValues.filter((v) => v !== value);
    setSelectedValues(newSelectedValues);
    onChange(newSelectedValues); // Call the onChange callback
  };

  return (
    <Flex vertical gap={16}>
      <Flex style={{ marginTop: 16 }}>
        {selectedValues.map((value) => (
          <Tag key={value} closable onClose={() => handleTagClose(value)}>
            {value}
          </Tag>
        ))}
      </Flex>
      <Form.Item style={{ width: "100%" }} label={label}>
        <Select
          showSearch
          value={searchValue}
          placeholder="Search..."
          onSearch={handleSearch}
          loading={searchHighlightsMutation.isPending}
          onSelect={handleSelect}
          filterOption={false}
        >
          {options.map((option) => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </Flex>
  );
};

export default SearchHighlights;
