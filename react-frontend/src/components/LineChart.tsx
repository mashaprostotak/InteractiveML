import React from 'react';
import { ResponsiveLine } from '@nivo/line';

type LineChartDataPoint = {
  x: number;
  y: number;
};

type LineChartProps = {
  id: string;
  data: LineChartDataPoint[];
};

export const LineChart = ({ id, data }: LineChartProps) => {
  const tickValues = [2010, 2022];
  return (
    <ResponsiveLine
      data={[
        {
          id: id,
          data: data,
        },
      ]}
      margin={{ top: 20, right: 25, bottom: 25, left: 25 }}
      xScale={{
        type: 'linear',
        min: 2010,
        max: 2022,
      }}
      yScale={{
        type: 'linear',
        min: 0,
        max: 10,
      }}
      yFormat=" >-.2f"
      axisTop={null}
      colors={{ scheme: 'dark2' }}
      axisRight={null}
      axisBottom={{
        tickSize: 3,
        tickPadding: 3,
        tickRotation: 0,
        legendPosition: 'middle',
        truncateTickAt: 0,
        tickValues: tickValues,
      }}
      axisLeft={{
        tickSize: 3,
        tickPadding: 3,
        legendOffset: -22,
        legendPosition: 'middle',
        tickValues: [0, 2, 4, 6, 8, 10],
      }}
      pointSize={1}
      enableGridX={false}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={2}
      pointBorderColor={{ from: 'serieColor' }}
      pointLabel="data.yFormatted"
      pointLabelYOffset={-12}
      enableTouchCrosshair={true}
      useMesh={true}
      theme={{
        background: 'white', // Set background color to white
      }}
    />
  );
};
