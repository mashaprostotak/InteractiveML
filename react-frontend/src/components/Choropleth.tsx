import React, { useState } from 'react';
import { Measurement } from '../types/measurement';
import geoData from '../data/world-countries.json';
import ResponsiveChoropleth from '../nivo-geo/src/ResponsiveChoropleth';
import { RangeSlider } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { LineChart } from './LineChart';
import { ChoroplethDefaultProps } from '../nivo-geo/src';

type MapProps = {
  yearMin: number;
  yearMax: number;
  numData: Measurement[] | null;
};

type RegionDataType = {
  id: string;
  value: number;
  year: number;
  country: string;
};
const Choropleth = ({ yearMax, numData }: MapProps) => {
  const navigate = useNavigate();

  const regionDataFull: RegionDataType[] = numData
    ? numData.map((item: Measurement) => {
        return {
          id: item.country_code,
          value: item.life_ladder,
          year: item.year,
          country: item.country_name,
        };
      })
    : [];

  const regionData: RegionDataType[] = regionDataFull
    .filter((item) => item.year <= yearMax)
    .map((d) => d)
    .sort((a, b) => b.year - a.year);

  return (
    <ResponsiveChoropleth
      {...ChoroplethDefaultProps}
      data={regionData}
      features={geoData.features}
      margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
      colors="greens"
      domain={[0, 10]}
      unknownColor="#666666"
      label="properties.name"
      valueFormat=".2s"
      projectionType="naturalEarth1"
      projectionTranslation={[0.5, 0.5]}
      projectionRotation={[0, 0, 0]}
      projectionScale={120}
      enableGraticule={false}
      graticuleLineColor="#dddddd"
      borderWidth={0.5}
      borderColor="#152538"
      tooltip={(e: any) => {
        if (!e?.feature?.data) {
          return <></>;
        }

        const target_country_code = e.feature.data.id;
        const target_country: string = e.feature.data.country;
        const data_points: {
          x: number;
          y: number;
        }[] = regionDataFull
          .filter((item) => item.id == target_country_code)
          .map((item) => {
            return {
              x: item.year,
              y: item.value,
            };
          });

        return (
          <div className="bg-gray-200 p-4 rounded-lg shadow-md max-w-sm mx-auto ">
            <div className="flex justify-center ">
              <div className="w-96 h-40">
                <LineChart id={target_country} data={data_points} />
              </div>
            </div>
            <div className="text-center mt-1">
              <h2 className="text-sm font-bold">{target_country}</h2>
            </div>
            <div className="text-center mt-1 text-sm">
              Click for custom predictions
            </div>
          </div>
        );
      }}
      onClick={(data: any) => {
        const country_name = data.data.country;
        const country_code = data.data.id;
        navigate(
          `predictions?country=${country_name}&country_code=${country_code}`
        );
      }}
      legends={[
        {
          anchor: 'bottom-left',
          direction: 'column',
          justify: true,
          translateX: 20,
          translateY: -100,
          itemsSpacing: 0,
          itemWidth: 94,
          itemHeight: 18,
          itemDirection: 'left-to-right',
          itemTextColor: '#444444',
          itemOpacity: 0.85,
          symbolSize: 18,
          effects: [
            {
              on: 'hover',
              style: {
                itemTextColor: '#000000',
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  );
};

export const ChoroplethContainer = ({ numData }: MapProps) => {
  const [yearRange, setYearRange] = useState<[number, number]>([2022, 2022]);
  return (
    <div className="section1 mb-10">
      <div className="flex flex-col px-4 max-md:max-w-full">
        <div className="flex items-center justify-center mt-3">
          <div className="text-2xl font-semibold leading-7 text-zinc-600 max-md:max-w-full">
            Self-reported Happiness, {yearRange[1]}
          </div>
        </div>
        <div className="mt-4 text-sm leading-5 text-zinc-600 max-md:max-w-full">
          “Please imagine a ladder, with steps numbered from 0 at the bottom to
          10 at the top. The top of the ladder represents the best possible life
          for you and the bottom of the ladder represents the worst possible
          life for you. On which step of the ladder would you say you personally
          feel you stand at this time?”
        </div>
      </div>
      <div id="choropleth-map">
        <div style={{ height: '60vh' }}>
          <Choropleth
            yearMin={yearRange[0]}
            yearMax={yearRange[1]}
            numData={numData}
          ></Choropleth>
        </div>
        <div
          className="flex justify-center items-center"
          id="choropleth-range-slider"
        >
          <RangeSlider
            minRange={0}
            min={2010}
            max={2022}
            step={1}
            maxRange={0}
            defaultValue={[2022, 2022]}
            style={{ width: '50%', height: '50%' }}
            color="gray"
            marks={[
              { value: 2010, label: '2010' },
              { value: 2022, label: '2022' },
            ]}
            onChange={setYearRange}
          />
        </div>
      </div>
    </div>
  );
};
