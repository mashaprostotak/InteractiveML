import React, { useEffect, useState } from 'react';
import { Container } from '@mantine/core';
import { getMeasurements } from '../services/resources/measurements';
import { Measurement } from '../types/measurement';
import { ChoroplethContainer } from './Choropleth';
import { ParallelCoordinateContainer } from './ParallelCoordinate';
import { Steps } from 'intro.js-react';
import { useIntroJsStatus } from '../hooks/intro-js-status';

export default function ExplorationPage() {
  // const [indicators, setIndicators] = useState<Indicator[] | null>(null);
  const [mapData, setMapData] = useState<Measurement[] | null>(null);
  const [parallelChartData, setParallelChartData] = useState<
    Measurement[] | null
  >(null);
  const [introJsStatus, setIntroJsStatus] = useIntroJsStatus();

  useEffect(() => {
    // async function fetchData() {
    //   const indicators = await getIndicators();
    //   setIndicators(indicators);
    // }

    async function fetchMapData() {
      const measurements = await getMeasurements('life_ladder');
      setMapData(measurements);
    }

    async function fetchParallelChartData() {
      const measurements = await getMeasurements(
        'life_ladder,log_gdp_per_capita,co2_emissions_tonnes_per_person,child_mortality_0_5_year_olds_dying_per_1000_born,children_per_woman_total_fertility,forest_coverage_percent,children_out_of_school_primary'
      );
      setParallelChartData(measurements);
    }

    // fetchData().catch(() => {});
    fetchMapData().catch(() => {});
    fetchParallelChartData().catch(() => {});
  }, []);

  return (
    <Container>
      <h1 className="text-3xl font-bold underline pt-3"></h1>
      <Steps
        enabled={introJsStatus.exploration === false}
        // enabled={true}
        steps={[
          {
            intro: 'Welcome to the exploration page!',
          },
          {
            element: '#choropleth-map',
            title: 'Happiness Map',
            intro:
              'This is the Happiness Map! You can hover over a country and see more data about its happiness level. You can also click on a country to proceed to the Prediction page.',
          },
          {
            element: '#choropleth-range-slider',
            title: 'Year-range slider',
            intro:
              'Using this slider you can set the time range for the happiness map',
          },
        ]}
        initialStep={0}
        options={{
          hideNext: false,
        }}
        onComplete={() => {
          setIntroJsStatus({
            ...introJsStatus,
            exploration: true,
          });
        }}
        onExit={() => {}}
      />

      <ChoroplethContainer
        yearMin={2010}
        yearMax={2022}
        numData={mapData}
      ></ChoroplethContainer>
      <ParallelCoordinateContainer
        year_min={2015}
        year_max={2017}
        happiness_min={7.1}
        happiness_max={9.9}
        numData={parallelChartData}
        selectedColumns={[]}
      ></ParallelCoordinateContainer>
    </Container>
  );
}
