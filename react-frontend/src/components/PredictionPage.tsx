import React, { useEffect, useState } from 'react';
import { Container, Button, Breadcrumbs, Text } from '@mantine/core';
import PredictionForm from './PredictionForm';
import {
  OptimalPolicyRequestData,
  OptimalPolicyResponseData,
  predictionsOptimal,
  predictionsCustom,
} from '../services/resources/predictions';
import DonutChart from './DonutChart';
import HappinessChart from './HappinessChart';
import ButterflyChart from './ButterflyChart';
import { Link } from 'react-router-dom';
import { Text as RechartsText } from 'recharts';
import { useIntroJsStatus } from '../hooks/intro-js-status';
import { Steps } from 'intro.js-react';
import { Indicator } from '../types/indicator';
import { getIndicators } from '../services/resources/indicators';

export default function PredictionPage() {
  const [introJsStatus, setIntroJsStatus] = useIntroJsStatus();

  const [optimalCombination, setOptimalCombination] =
    useState<OptimalPolicyResponseData | null>(null);
  const [customCombination, setCustomCombination] =
    useState<OptimalPolicyResponseData | null>(null);
  const [predictionLoadingState, setPredictionLoadingState] = useState<
    'error' | 'idle' | 'loading'
  >('idle');

  async function loadPredictions(data: OptimalPolicyRequestData) {
    setPredictionLoadingState('loading');
    try {
      const resultOptimal = await predictionsOptimal(data);
      const resultCustom = await predictionsCustom(data);
      setOptimalCombination(resultOptimal);
      setCustomCombination(resultCustom);
    } catch (error) {
      setPredictionLoadingState('error');
      return;
    }

    setPredictionLoadingState('idle');
  }

  const [indicators, setIndicators] = useState<Indicator[]>([]);

  useEffect(() => {
    async function loadData() {
      const data = await getIndicators();
      setIndicators(data.filter((x) => x.concept !== 'life_ladder'));
    }

    loadData().catch(() => {});
  }, []);

  const [useOptimal, setUseOptimal] = useState(true);

  const toggleCombination = () => {
    setUseOptimal(!useOptimal);
  };

  // Prepare the title text based on useOptimal state
  // const happinessChartText = `${useOptimal ? 'Optimal' : 'Custom'}`;

  return (
    <Container pt="lg">
      <Steps
        enabled={introJsStatus.predictions === false}
        //enabled={true}
        steps={[
          {
            intro: 'Welcome to the predictions page!',
          },
          {
            element: '#prediction-form',
            title: 'Prediction Form',
            intro:
              'Fill out the form to get the optimal policy combination for a country',
          },
          {
            element: '#policy-card',
            title: 'First policy',
            intro: 'Enter the information for each available policy',
          },
          {
            element: '#name',
            title: 'Name',
            intro:
              'Enter the name/ID of the policy and click on the "save" button on the right',
          },
          {
            element: '#metric',
            title: 'Metric',
            intro: 'Specify the metric affected by this policy',
          },
          {
            element: '#cost',
            title: 'Cost',
            intro: 'Provide the costs of this policy',
          },
          {
            element: '#metricchange',
            title: 'Metric change',
            intro:
              'Indicate how the provided metric will be impacted by this policy',
          },
          {
            element: '#duration',
            title: 'Duration',
            intro:
              'Enter the time (in years) it will take to achieve this metric change if the policy is implemented',
          },
          {
            element: '#confidence',
            title: 'Confidence',
            intro: 'Specify how confident are you in the affects of the policy',
          },
          {
            element: '#new-policy',
            title: 'New policy',
            intro:
              'If you want to add another policy, enter its name and click on the + button',
          },
          {
            element: '#submit',
            intro: 'Click this button to get the predictions',
          },
        ]}
        initialStep={0}
        options={{
          hideNext: false,
        }}
        onComplete={() => {
          setIntroJsStatus({
            ...introJsStatus,
            predictions: true,
          });
        }}
        onExit={() => {}}
      />

      <h1 className="text-2xl font-bold">Predictions page</h1>
      <Breadcrumbs separator="→" mb="md" pb="xs">
        <Link to="/">
          <Text c="green" td="underline">
            Exploration Page
          </Text>
        </Link>
        <Text>Predictions Page</Text>
      </Breadcrumbs>

      <div id="prediction-form">
        <PredictionForm
          onSubmit={loadPredictions}
          indicators={indicators}
          predictionLoadingState={predictionLoadingState}
        />
      </div>

      {optimalCombination ? (
        <div className="mt-12 mb-2">
          <Button
            className="mr-2"
            style={
              !useOptimal
                ? {
                    backgroundColor: 'white',
                    border: '1px solid black',
                    color: 'black',
                  }
                : {}
            }
            onClick={toggleCombination}
            aria-label="Toggle Chart Data"
          >
            Optimal
          </Button>
          <Button
            style={
              useOptimal
                ? {
                    backgroundColor: 'white',
                    border: '1px solid black',
                    color: 'black',
                  }
                : {}
            }
            onClick={toggleCombination}
            aria-label="Toggle Chart Data"
          >
            Custom
          </Button>
        </div>
      ) : (
        <p></p>
      )}
      {optimalCombination ? (
        <div className="flex-grow pb-10 pt-5">
          <div className="flex flex-grow flex-col">
            <div className="flex items-center mb-5">
              <RechartsText className="font-bold mr-4">
                Happiness Chart
              </RechartsText>
            </div>
            <HappinessChart
              optimalCombination={
                useOptimal ? optimalCombination! : customCombination!
              }
            />
          </div>
        </div>
      ) : (
        <p></p>
      )}
      <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
        {optimalCombination ? (
          <div style={{ display: 'flex', flexGrow: 3 }}>
            <div
              style={{ display: 'flex', flexGrow: 1, flexDirection: 'column' }}
            >
              <RechartsText className="font-bold mb-2">
                Metric Changes
              </RechartsText>
              <ButterflyChart
                optimalCombination={optimalCombination!}
                userCombination={customCombination!}
                indicators={indicators}
              />
            </div>
          </div>
        ) : (
          <p></p>
        )}
        {optimalCombination ? (
          <div style={{ display: 'flex', flexGrow: 1, paddingLeft: '40px' }}>
            {' '}
            {/* 40px as an example for pl-10 */}
            <div
              style={{ display: 'flex', flexGrow: 1, flexDirection: 'column' }}
            >
              <RechartsText className="font-bold">
                Policy Combination
              </RechartsText>
              <DonutChart
                optimalCombination={
                  useOptimal ? optimalCombination! : customCombination!
                }
              />
            </div>
          </div>
        ) : (
          <p></p>
        )}
      </div>
    </Container>
  );
}
