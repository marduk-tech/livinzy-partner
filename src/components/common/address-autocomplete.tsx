import React, { useState } from 'react';
import { Select } from 'antd';
import axios from 'axios';

const { Option } = Select;

type Prediction = {
  place_id: string;
  description: string;
};

const AddressAutocomplete: React.FC = () => {
  const [options, setOptions] = useState<any>([]);

  const handleSearch = async (value: string) => {
    if (!value) {
      setOptions([]);
      return;
    }
  
    try {
      const response = await axios.get<{
        predictions: Prediction[];
      }>(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${value}&key=AIzaSyC6SsowlR-xf9V3yir8qIyBdAMe124fFpk&types=address`
      );

      if (response.data.predictions) {
        const addresses = response.data.predictions.map((prediction) => ({
          value: prediction.place_id,
          label: prediction.description,
        }));
        setOptions(addresses);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

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
      style={{ width: '100%' }}
    >
      {options.map((option:any) => (
        <Option key={option.value} value={option.value}>
          {option.label}
        </Option>
      ))}
    </Select>
  );
};

export default AddressAutocomplete;
