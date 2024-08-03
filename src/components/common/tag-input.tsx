import React, { useState } from "react";
import { Flex, Input, Tag } from "antd";
import { BorderOuterOutlined, CloseOutlined } from "@ant-design/icons";

interface TagInputProps {
  initialTags?: string[];
  onTagsChange: (tags: string[]) => void;
}

const TagInput: React.FC<TagInputProps> = ({
  initialTags = [],
  onTagsChange,
}) => {
  const [tags, setTags] = useState<string[]>(initialTags || []);
  const [inputValue, setInputValue] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && !tags.includes(inputValue)) {
      setTags([...tags, inputValue]);
      onTagsChange(tags);
    }
    setInputValue("");
  };

  const handleClose = (removedTag: string) => {
    setTags(tags.filter((tag) => tag !== removedTag));
  };

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
