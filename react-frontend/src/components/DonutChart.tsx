import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Label,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';
import { OptimalPolicyResponseData } from '../services/resources/predictions';
import { Box, Table, Tooltip as MantineTooltip } from '@mantine/core';
import { FaQuestion } from 'react-icons/fa';
import { IndicatorChange } from '../types/prediction';

const COLORS = [
  '#007F5F',
  '#2B9348',
  '#55A630',
  '#80B918',
  '#AACC00',
  '#D4D700',
  '#EEEF20',
  '#FFFF3F',
];

const DonutChartTooltip: React.FC<
  TooltipProps<any, any> & { changes: IndicatorChange[] }
> = (props) => {
  if (!props.active || !props.payload || !props.payload.length) {
    return <></>;
  }

  return (
    <Box className="p-3 border-gray-500 border bg-white rounded">
      {props.payload[0].name}: {props.payload[0].value}
      {props.changes.map((change, i) => (
        <div key={i}>
          {change.indicator}: {change.change}
        </div>
      ))}
    </Box>
  );
};

interface Props {
  optimalCombination: OptimalPolicyResponseData;
}
const DonutChart: React.FC<Props> = ({ optimalCombination }) => (
  <div className="relative w-full h-auto">
    <div
      style={{ position: 'absolute', top: '-20px', right: '0px', zIndex: 10 }}
    >
      <MantineTooltip
        multiline
        w={220}
        withArrow
        transitionProps={{ duration: 200 }}
        label="This donut chart provides a visual breakdown of how the budget is distributed across various selected policies. Each segment represents a different policy, color-coded for easy differentiation. The chart offers a clear and immediate understanding of which policies are allocated more resources, enabling stakeholders to quickly assess the financial focus areas."
        className="absolute top-0 right-0"
      >
        <div className="h-6 w-6 bg-white rounded-full border-grey border-2 justify-center items-center flex">
          <FaQuestion size={12} color="grey"></FaQuestion>
        </div>
      </MantineTooltip>
    </div>
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={optimalCombination.policies.map((policy) => ({
            name: policy.name,
            value: policy.cost,
          }))}
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={2}
          dataKey="value"
        >
          {optimalCombination.policies.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
          <Label
            value={`${optimalCombination.policies.length} Policies`}
            position="center"
            className="label-top"
            style={{ fill: 'gray', fontSize: 14, fontWeight: 'bold' }}
          />
        </Pie>
        <Tooltip
          content={(props) => (
            <DonutChartTooltip {...props} changes={[]}></DonutChartTooltip>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
    <div className="container mx-auto p-4 flex justify-center">
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th className="text-center text-gray-600"></Table.Th>
            <Table.Th className="text-center text-gray-600">Policy</Table.Th>
            <Table.Th className="text-center text-gray-600">Cost</Table.Th>
            <Table.Th className="text-center text-gray-600">
              % of Budget
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {optimalCombination.policies.map((item, index) => (
            <Table.Tr key={item.name}>
              <Table.Td className="text-center">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
              </Table.Td>
              <Table.Td className="text-center">{item.name}</Table.Td>
              <Table.Td className="text-center">{item.cost}</Table.Td>
              <Table.Td className="text-center">
                {(
                  (item.cost /
                    optimalCombination.policies.reduce(
                      (accumulator, currentPolicy) =>
                        accumulator + currentPolicy.cost,
                      0
                    )) *
                  100
                ).toFixed(2)}
                %
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </div>
  </div>
);
export default DonutChart;
