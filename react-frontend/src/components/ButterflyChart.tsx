import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { OptimalPolicyResponseData } from '../services/resources/predictions';
import { Tooltip as MantineTooltip } from '@mantine/core';
import { FaQuestion } from 'react-icons/fa';
import { Indicator } from '../types/indicator';

interface DataItem {
  name: string;
  optimal: number;
  userDefined: number;
  originalOptimal: number;
  originalUserDefined: number;
}

const transformData = (data: DataItem[]): DataItem[] => {
  return data.map((item: DataItem) => ({
    ...item,
    optimal: Math.sign(item.optimal) * Math.log10(Math.abs(item.optimal) + 1),
    userDefined:
      Math.sign(item.userDefined) * Math.log10(Math.abs(item.userDefined) + 1),
  }));
};

interface Props {
  optimalCombination: OptimalPolicyResponseData;
  userCombination: OptimalPolicyResponseData;
  indicators: Indicator[];
}

const ButterflyChart: React.FC<Props> = ({
  optimalCombination,
  userCombination,
}) => {
  const data = [];
  for (let i = 0; i < optimalCombination.indicator_changes.length; i++) {
    // Ensure that a matching indicator is found, else use a fallback name or handle it accordingly
    const name = optimalCombination.indicator_changes[i].indicator_name_short;

    data.push({
      name: name,
      optimal: optimalCombination.indicator_changes[i].change,
      userDefined: userCombination.indicator_changes[i].change,
      originalOptimal: optimalCombination.indicator_changes[i].change,
      originalUserDefined: userCombination.indicator_changes[i].change,
    });
  }

  const transformedData = transformData(data);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { name, originalOptimal, originalUserDefined } = payload[0].payload;
      return (
        <div className="custom-tooltip bg-white p-2 border border-gray-300">
          <p>{name}</p>
          <p style={{ color: '#238443' }}>Optimal: {originalOptimal}</p>
          <p style={{ color: '#ADDD8E' }}>
            User Defined: {originalUserDefined}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative w-full h-auto">
      <div
        style={{
          position: 'absolute',
          top: '-30px',
          right: '20px',
          zIndex: 10,
        }}
      >
        <MantineTooltip
          multiline
          w={220}
          withArrow
          transitionProps={{ duration: 200 }}
          label="This butterfly chart displays the features input into our happiness prediction model, arranged symmetrically on either side of a central axis. Each 'wing' of the chart corresponds to different categories of features, such as demographic data, lifestyle choices, and environmental factors."
          className="absolute top-0 right-0"
        >
          <div className="h-6 w-6 bg-white rounded-full border-grey border-2 justify-center items-center flex">
            <FaQuestion size={12} color="grey"></FaQuestion>
          </div>
        </MantineTooltip>
      </div>
      <ResponsiveContainer width="100%" height={600}>
        <BarChart
          layout="vertical"
          data={transformedData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            label={{
              value: 'Log Scale',
              position: 'insideBottomRight',
              offset: -5,
            }}
          />

          <YAxis type="category" dataKey="name" width={100} fontSize={10} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="optimal" fill="#238443" />
          <Bar dataKey="userDefined" fill="#ADDD8E" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ButterflyChart;
