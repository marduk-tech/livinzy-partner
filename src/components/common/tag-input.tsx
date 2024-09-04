import { BorderOuterOutlined, CloseOutlined } from "@ant-design/icons";
import { Flex, Input, Tag } from "antd";
import React, { useState } from "react";

interface TagInputProps {
  initialTags?: string[];
  onTagsChange: (tags: string[]) => void;
}

/**
 * Component for inputting and displaying tags
 * @param initialTags Initial array of tags
 * @param onTagsChange Function to call when tags change
 */
const TagInput: React.FC<TagInputProps> = ({
  initialTags = [],
  onTagsChange,
}) => {
  const [tags, setTags] = useState<string[]>(initialTags || []);
  const [inputValue, setInputValue] = useState<string>("");

  /**
   * Handles input change
   * @param e Input change event
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  /**
   * Handles input confirmation (adding a new tag)
   */
  const handleInputConfirm = () => {
    if (inputValue && !tags.includes(inputValue)) {
      setTags([...tags, inputValue]);
      onTagsChange(tags);
    }
    setInputValue("");
  };

  /**
   * Handles removal of a tag
   * @param removedTag Tag to remove
   */
  const handleClose = (removedTag: string) => {
    setTags(tags.filter((tag) => tag !== removedTag));
  };

  /**
   * Handles key press in the input
   * @param e Keyboard event
   */
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      handleInputConfirm();
    }
  };

  return (
    <Flex vertical>
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        onPressEnter={handleInputConfirm}
        placeholder="Enter a name and press enter."
      />
      {tags && tags.length ? (
        <Flex style={{ marginTop: 16 }}>
          {tags.map((tag) => (
            <Tag
              key={tag}
              icon={<BorderOuterOutlined />}
              color="blue"
              style={{
                fontSize: 16,
                padding: "8px 16px",
                textTransform: "capitalize",
                borderRadius: 16,
              }}
              closable
              onClose={() => handleClose(tag)}
              closeIcon={<CloseOutlined />}
            >
              {tag}
            </Tag>
          ))}
        </Flex>
      ) : null}
    </Flex>
  );
};

export default TagInput;
