import React, { useState } from 'react';
import {
  ResponsiveParallelCoordinates,
  Variable,
} from '@nivo/parallel-coordinates';
import { Measurement } from '../types/measurement';
import { RangeSlider, MultiSelect, Text, rem } from '@mantine/core';
import { IconMoodHappy, IconMoodSadDizzy } from '@tabler/icons-react';
import { CustomTooltip as CustomTooltipComponent } from './CustomToolTip';

type ChartProps = {
  year_min: number;
  year_max: number;
  happiness_min: number;
  happiness_max: number;
  numData: Measurement[] | null;
  selectedColumns: string[] | null;
};

interface ChartDataBaseProperties {
  id: string;
  country: string;
}

type ChartData = ChartDataBaseProperties & {
  [key: string]: any;
} & Measurement;

const columns: readonly Variable<ChartData>[] = [
  {
    id: 'children_per_woman_total_fertility',
    label: 'Babies/woman',
    value: 'children_per_woman_total_fertility',
    legendOffset: 15,
  },
  {
    id: 'co2_emissions_tonnes_per_person',
    label: 'CO2 emission',
    value: 'co2_emissions_tonnes_per_person',
    legendOffset: 15,
    ticksPosition: 'before',
  },
  {
    id: 'child_mortality_0_5_year_olds_dying_per_1000_born',
    label: 'Child mortality',
    value: 'child_mortality_0_5_year_olds_dying_per_1000_born',
    legendOffset: 15,
  },
  {
    id: 'log_gdp_per_capita',
    label: 'GDP',
    value: 'log_gdp_per_capita',
    legendOffset: 15,
  },
  {
    id: 'children_out_of_school_primary',
    label: 'Child out of school',
    value: 'children_out_of_school_primary',
    legendOffset: 15,
  },
  {
    id: 'life_ladder',
    label: 'Happiness score',
    value: 'life_ladder',
    legendOffset: 15,
  },
];

const ParallelCoordinateChart = ({
  year_min,
  year_max,
  happiness_min,
  happiness_max,
  numData,
  selectedColumns,
}: ChartProps) => {
  const chartData: ChartData[] = numData
    ? numData
        .filter(
          (item) =>
            item.year >= (year_min >= 2019 ? 2017 : year_min) &&
            item.year <= year_max
        )
        .map((item, i) => {
          return {
            ...item,
            id:
              item.life_ladder >= happiness_min &&
              item.life_ladder <= happiness_max
                ? `A-${i}`
                : `B-${i}`,
            country: item.country_name,
            life_ladder: item.life_ladder,
          };
        })
    : [];

  const colors = chartData.map((item) =>
    item.life_ladder >= happiness_min && item.life_ladder <= happiness_max
      ? '#69b3a2'
      : '#E8E8E8'
  );

  const columns_display: readonly Variable<ChartData>[] = columns
    .filter(
      (c) =>
        c.label &&
        (selectedColumns?.includes(c.label) || c.label == 'Happiness score')
    )
    .map((c) => c);

  return (
    <ResponsiveParallelCoordinates
      colors={colors}
      lineOpacity={0.9}
      tooltip={CustomTooltipComponent}
      theme={{
        text: {
          fontFamily: 'sans-serif',
          fontSize: 11,
          fill: '#333333',
          outlineWidth: 0,
          outlineColor: 'transparent',
        },
        axis: {
          domain: {
            line: {
              stroke: '#777777',
              strokeWidth: 1,
            },
          },
          ticks: {
            line: {
              stroke: '#777777',
              strokeWidth: 2,
            },
            text: {},
          },
          legend: {
            text: {
              fontSize: 13,
              fontFamily: 'Helvetica',
            },
          },
        },
        grid: {
          line: {
            stroke: '#dddddd',
            strokeWidth: 1,
          },
        },
      }}
      data={chartData}
      variables={columns_display}
      margin={{ top: 50, right: 120, bottom: 50, left: 60 }}
      layout={'horizontal'}
      lineWidth={1.5}
    />
  );
};

export const ParallelCoordinateContainer = ({
  // happiness_min,
  // happiness_max,
  numData,
}: ChartProps) => {
  const [happinessRange, setHappinessRange] = useState<[number, number]>([
    7.1, 10,
  ]);
  const [yearRange, setYearRange] = useState<[number, number]>([2015, 2017]);
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([
    'GDP',
    'Child mortality',
    'Child out of school',
  ]);

  return (
    <div>
      <div className="flex items-center justify-center">
        <div className="text-2xl font-semibold leading-7 text-zinc-600 max-md:max-w-full">
          Happiness explained, what do happy country have in common?
        </div>
      </div>
      <br />
      <div className="container">
        <div className="left inline-block mr-14" style={{ width: '60%' }}>
          <MultiSelect
            label="Choose metrics to analyze"
            placeholder="Pick metric"
            data={[
              'GDP',
              'Child mortality',
              'CO2 emission',
              'Babies/woman',
              'Child out of school',
            ]}
            defaultValue={['GDP', 'Child mortality', 'Child out of school']}
            maxValues={6}
            onChange={setSelectedIndicators}
            clearable
            searchable
          />
        </div>

        <div className="right inline-block" style={{ width: '30%' }}>
          <div className="text-right mb-2">
            <Text
              size="sm"
              style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
            >
              Happiness scores to highlight
            </Text>
          </div>
          <RangeSlider
            minRange={0.1}
            min={0}
            max={10}
            step={0.1}
            defaultValue={[7.1, 10]}
            className="w-full"
            styles={{ thumb: { borderWidth: rem(2), padding: rem(1) } }}
            marks={[
              { value: 0, label: '0' },
              { value: 10, label: '10' },
            ]}
            color="teal"
            thumbSize={26}
            thumbChildren={[
              <IconMoodSadDizzy size="1rem" key="1" />,
              <IconMoodHappy size="1rem" key="2" />,
            ]}
            onChange={setHappinessRange}
          />
        </div>
      </div>
      <div
        className="flex justify-between items-center"
        id="parallel-coordinates-chart"
        style={{ height: '55vh', width: '70vw' }}
      >
        <ParallelCoordinateChart
          year_min={yearRange[0]}
          year_max={yearRange[1]}
          happiness_min={happinessRange[0]}
          happiness_max={happinessRange[1]}
          numData={numData}
          selectedColumns={selectedIndicators}
        ></ParallelCoordinateChart>
      </div>
      <div className="flex justify-center items-center mb-4 md:mb-8 lg:mb-12">
        <RangeSlider
          minRange={1}
          maxRange={5}
          min={2010}
          max={2022}
          step={1}
          defaultValue={[2015, 2017]}
          style={{ width: '40%', height: '50%' }}
          color="gray"
          marks={[
            { value: 2010, label: '2010' },
            { value: 2022, label: '2022' },
          ]}
          onChange={setYearRange}
        />
      </div>
    </div>
  );
};
