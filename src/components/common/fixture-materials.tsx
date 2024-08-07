import React, { useState } from "react";
import { Select, Flex, Button } from "antd";
import {
  MaterialFinishMeta,
  MaterialMeta,
  MaterialVariationMeta,
} from "../../interfaces/Meta";
import { PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

const FixtureMaterials: React.FC<any> = ({
  materials,
  variations,
  finishes,
  onSave,
  onSaveAndAdd,
}) => {
  const [material, setMaterial] = useState<string>();
  const [materialVariation, setMaterialariation] = useState<string>();
  const [materialFinish, setMaterialFinish] = useState<string>();
  const [customMaterial, setCustomMaterial] = useState<string>();

  return (
    <Flex gap={16}>
      <Select
        style={{ width: 250 }}
        placeholder="Select a material"
        onChange={(value: string) => {
          setMaterial(value);
        }}
        options={materials.map((material: MaterialMeta) => ({
          label: material.name,
          value: material._id,
        }))}
      ></Select>

      <Select
        style={{ width: 250 }}
        placeholder="Select sub material"
        disabled={!material}
        onChange={(value: string) => {
          setMaterialariation(value);
        }}
        options={variations.map((variation: MaterialVariationMeta) => ({
          label: variation.name,
          value: variation._id,
        }))}
      ></Select>
      <Select
        style={{ width: 250 }}
        placeholder="Select a finish"
        disabled={!material}
        onChange={(value: string) => {
          setMaterialFinish(value);
        }}
        options={finishes.map((finish: MaterialFinishMeta) => ({
          label: finish.name,
          value: finish._id,
        }))}
      ></Select>
      <Button
        type="default"
        icon={<PlusOutlined></PlusOutlined>}
        onClick={() => {
          onSave({
            material,
            materialVariation,
            materialFinish,
            customMaterial,
          });
        }}
      ></Button>
    </Flex>
  );
};

export default FixtureMaterials;
