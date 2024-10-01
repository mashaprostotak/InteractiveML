import React from 'react';
import { OptimalPolicyResponseData } from '../services/resources/predictions';
import {
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Area,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';
import { Tooltip as MantineTooltip } from '@mantine/core';
import { FaQuestion } from 'react-icons/fa';

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    color?: string;
    dataKey?: string;
    fill?: string;
    name?: string;
    stroke?: string;
    strokeWidth?: number;
    value?: number;
  }>;
  label?: string;
}

interface LegendPayload {
  color: string;
  dataKey: string;
  value: string;
  type: string;
}

interface CustomLegendProps {
  payload?: LegendPayload[];
}

const CustomLegend: React.FC<CustomLegendProps> = ({ payload = [] }) => (
  <ul className="custom-legend">
    <li
      className=" flex justify-center"
      key={`item-1`}
      style={{ color: payload[1].color }}
    >
      <span style={{ color: payload[1].color }}>■ </span>
      Happiness Index
    </li>
  </ul>
);

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length > 0) {
    return (
      <div className="bg-white p-2 border rounded shadow-lg">
        <p>{`Year: ${label}`}</p>
        <p>{`Mean: ${payload[1].value ? payload[1].value.toFixed(2) : 'N/A'}`}</p>
        <p>{`Range: ${payload.length > 1 ? payload[2].value?.toFixed(2) : 'N/A'} - ${payload.length > 2 ? payload[0].value?.toFixed(2) : 'N/A'}`}</p>
      </div>
    );
  }
  return null;
};

interface Props {
  optimalCombination: OptimalPolicyResponseData;
}

const HappinessChart: React.FC<Props> = ({ optimalCombination }) => {
  const preparedData = optimalCombination.predictions.map((prediction) => {
    const maxStandardDeviation = optimalCombination.predictions.reduce(
      (max, prediction) => {
        return Math.max(max, prediction.standard_deviation);
      },
      0
    );

    const { year, mean, standard_deviation } = prediction;

    //We scale the maximum standard deviation to deviate by exactly 1 happiness point on the chart
    let lower = mean - standard_deviation / maxStandardDeviation;
    let upper = mean + standard_deviation / maxStandardDeviation;

    // Adjust bounds to be at most 1 unit from the mean
    lower = Math.max(lower, mean - 1);
    upper = Math.min(upper, mean + 1);

    return {
      year,
      value: mean,
      lower,
      upper,
    };
  });

  return (
    <div className="relative w-full h-auto">
      <div
        style={{ position: 'absolute', top: '-50px', right: '0px', zIndex: 10 }}
      >
        <MantineTooltip
          multiline
          w={220}
          withArrow
          transitionProps={{ duration: 200 }}
          label="The Happiness Chart visually forecasts the future happiness scores of the current country, incorporating data on expected well-being. The shaded areas on the chart represent uncertainty, indicating potential variations from the predicted values due to unforeseen factors. This graphical representation helps viewers quickly grasp the expected trends in national happiness and the confidence in these predictions.
        "
          className="absolute top-0 right-0"
        >
          <div className="h-6 w-6 bg-white rounded-full border-grey border-2 justify-center items-center flex">
            <FaQuestion size={12} color="grey"></FaQuestion>
          </div>
        </MantineTooltip>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={preparedData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <XAxis dataKey="year" />
          <YAxis
            label={{
              value: 'Happiness',
              angle: -90,
              position: 'insideLeft',
              dx: 10,
            }}
          />

          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
          <CustomLegend />
          <Area
            type="monotone"
            dataKey="upper"
            stroke="none"
            fill="#98FB98"
            fillOpacity={0.3}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#006400"
            fill="#98FB98"
            fillOpacity={0}
          />
          <Area
            type="monotone"
            dataKey="lower"
            stroke="none"
            fill="#FFFFFF"
            fillOpacity={1}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
export default HappinessChart;
