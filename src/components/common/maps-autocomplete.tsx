import { Select } from "antd";
import axios from "axios";
import React, { useState } from "react";

const { Option } = Select;

type Prediction = {
  place_id: string;
  description: string;
};

/**
 * Component for address autocomplete using Google Maps API
 */
const AddressAutocomplete: React.FC = () => {
  const [options, setOptions] = useState<any>([]);

  /**
   * Handles search input change
   * @param value Search input value
   */
  const handleSearch = async (value: string) => {
    if (!value) {
      setOptions([]);
      return;
    }

    try {
      const response = await axios.get<{
        predictions: Prediction[];
      }>(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${value}&key=--&types=address`
      );

      if (response.data.predictions) {
        const addresses = response.data.predictions.map((prediction) => ({
          value: prediction.place_id,
          label: prediction.description,
        }));
        setOptions(addresses);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  /**
   * Handles selection of an address
   * @param value Selected address value
   */
  const handleChange = (value: string) => {
    console.log(`Selected address: ${value}`);
  };

  return (
    <Select
      showSearch
      placeholder="Select an address"
      defaultActiveFirstOption={false}
      showArrow={false}
      filterOption={false}
      onSearch={handleSearch}
      onChange={handleChange}
      notFoundContent={null}
      style={{ width: "100%" }}
    >
      {options.map((option: any) => (
        <Option key={option.value} value={option.value}>
          {option.label}
        </Option>
      ))}
    </Select>
  );
};

export default AddressAutocomplete;
