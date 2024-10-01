import React, { useState } from 'react';
import {
  Checkbox,
  TextInput,
  NumberInput,
  UnstyledButton,
  Text,
  Select,
} from '@mantine/core';
import { FormPolicy } from '../types/policy';
import {
  FaBalanceScale,
  FaCalendarDay,
  FaChartLine,
  FaEuroSign,
  FaPencilAlt,
  FaQuestion,
  FaSave,
} from 'react-icons/fa';
import { GetInputPropsReturnType } from '@mantine/form/lib/types';
import { Indicator } from '../types/indicator';
import { IndicatorValue } from '../types/indicator_value';

interface InputProps {
  policy: FormPolicy;
  getInputProps: (field: string) => GetInputPropsReturnType;
  indicators: Indicator[];
  currentIndicatorValues: IndicatorValue[] | null;
}
const PolicyComponent: React.FC<InputProps> = ({
  policy,
  getInputProps,
  indicators,
  currentIndicatorValues,
}) => {
  const [editingName, setEditingName] = useState(policy.name === '');

  function updateName() {
    // exploits validate on blur
    getInputProps('name').onBlur();

    if (getInputProps('name').error || !getInputProps('name').value) {
      return;
    }

    setEditingName(false);
  }

  function startEditingName() {
    setEditingName(true);
  }

  // Generate the data array with value and label
  const data = indicators.map((x) => {
    const matchedData = currentIndicatorValues?.find(
      (item) => item.concept === x.concept
    );
    return {
      value: x.concept,
      label: matchedData
        ? `${x.name_short} (${String(matchedData.value)})`
        : x.name_short,
    };
  });

  return (
    <div className="shadow rounded-md border-2 border-green-600 bg-white text-center p-4">
      <div id="name" className="py-3 h-16">
        {editingName ? (
          <TextInput
            variant="unstyled"
            classNames={{
              input: `!border-0 !border-b ${
                getInputProps('name').error
                  ? '!border-red-600'
                  : '!border-green-600'
              } !rounded-none !px-2`,
            }}
            {...getInputProps('name')}
            className="flex-grow"
            placeholder="Policy Name"
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                updateName();
              }
            }}
            rightSection={
              <UnstyledButton onClick={updateName}>
                <FaSave className="text-green-600" />
              </UnstyledButton>
            }
          />
        ) : (
          <div className="flex justify-center gap-2">
            <Text fw={'bold'}>{policy.name}</Text>
            <UnstyledButton onClick={startEditingName}>
              <FaPencilAlt />
            </UnstyledButton>
          </div>
        )}
      </div>
      <div id="metric" className="flex items-center gap-2">
        <FaBalanceScale title="Metric" className="text-gray-800" />
        <Select
          mt={4}
          className="theme-border flex-grow"
          placeholder="Metric"
          {...getInputProps('indicator')}
          data={data}
        />
      </div>
      <div id="cost" className="flex items-center gap-2">
        <FaEuroSign title="Cost" className="text-gray-800" />
        <NumberInput
          min={0}
          mt={4}
          className="theme-border flex-grow"
          placeholder="Cost"
          {...getInputProps('cost')}
        />
      </div>
      <div id="metricchange" className="flex items-center gap-2">
        <FaChartLine title="Metric Change" className="text-gray-800" />
        <NumberInput
          mt={4}
          className="theme-border flex-grow"
          placeholder="Metric Change"
          {...getInputProps('change')}
        />
      </div>
      <div id="duration" className="flex items-center gap-2">
        <FaCalendarDay title="Duration (Years)" className="text-gray-800" />
        <NumberInput
          min={0}
          mt={4}
          className="theme-border flex-grow"
          placeholder="Duration (Years)"
          {...getInputProps('years')}
        />
      </div>
      <div id="confidence" className="flex items-center gap-2">
        <FaQuestion title="Confidence" className="text-gray-800" />
        <NumberInput
          min={0}
          mt={4}
          className="theme-border flex-grow"
          placeholder="Confidence"
          {...getInputProps('uncertainty')}
        />
      </div>
      <div>
        <Checkbox
          className="mt-2"
          label="User Selection"
          {...getInputProps('userSelection')}
        />
      </div>
    </div>
  );
};

export default PolicyComponent;
