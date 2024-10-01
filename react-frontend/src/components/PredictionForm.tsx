import { TextInput, ActionIcon, Button, NumberInput } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import PolicyComponent from './PolicyComponent';
import { Indicator } from '../types/indicator';
import { useForm, isNotEmpty, isInRange } from '@mantine/form';
import { FormPolicy, Policy } from '../types/policy';
import { OptimalPolicyRequestData } from '../services/resources/predictions';
import { useLocation } from 'react-router-dom';
import { IndicatorValue } from '../types/indicator_value';
import { getCurrentIndicators } from '../services/resources/indicators';

interface Props {
  onSubmit: (data: OptimalPolicyRequestData) => void;
  indicators: Indicator[];
  predictionLoadingState: 'error' | 'idle' | 'loading';
}

const PredictionForm: React.FC<Props> = ({
  onSubmit,
  indicators,
  predictionLoadingState,
}) => {
  const location = useLocation();

  // Function to get query parameter by name
  const getQueryParam = (param: string) => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get(param);
  };

  const countryCode = getQueryParam('country_code');
  const country = getQueryParam('country');

  const newPolicyNameForm = useForm({
    initialValues: { name: '' },
    validate: { name: isNotEmpty() },
  });

  const [currentIndicatorValues, setCurrentIndicatorValues] = useState<
    IndicatorValue[] | null
  >(null);

  async function loadCurrentIndicators() {
    if (!countryCode) {
      return;
    }

    try {
      const res = await getCurrentIndicators({
        country_code: countryCode,
        indicators: indicators,
        current_year: 2022,
      });
      setCurrentIndicatorValues(res.current_indicators);
    } catch (error) {
      return;
    }
  }

  useEffect(() => {
    if (indicators.length > 0) {
      loadCurrentIndicators().catch(() => {});
    }
  }, [indicators, countryCode]);

  const form = useForm<{
    budget: string | number;
    policies: FormPolicy[];
  }>({
    mode: 'controlled',
    initialValues: {
      budget: '',
      policies: [
        {
          change: '',
          name: '',
          cost: '',
          indicator: null,
          uncertainty: '',
          years: '',
          userSelection: false,
        },
      ],
    },
    validateInputOnBlur: true,
    validate: {
      budget: isInRange({ min: 1 }),
      policies: {
        name: isNotEmpty(),
        change: (value) => {
          if (value === 0) {
            return 'Change cannot be 0';
          }
          return isNotEmpty()(value);
        },
        cost: isInRange({ min: 1 }),
        indicator: isNotEmpty(),
        uncertainty: (value) => {
          if (!(0 <= Number(value) && Number(value) <= 100)) {
            return 'Confidence must be between 0 and 100';
          }
          return isNotEmpty()(value);
        },
        years: (value) => {
          if (!(1 <= Number(value) && Number(value) <= 50)) {
            return 'Duration must be between 1 and 50 years';
          }
          return isNotEmpty()(value);
        },
      },
    },
  });

  function addNewPolicy() {
    if (newPolicyNameForm.validate().hasErrors) {
      return;
    }

    form.insertListItem('policies', {
      change: '',
      name: newPolicyNameForm.getValues().name,
      cost: '',
      indicator: null,
      uncertainty: '',
      years: '',
      userSelection: false,
    });
    newPolicyNameForm.clearErrors();
    newPolicyNameForm.setValues({ name: '' });
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (form.validate().hasErrors) {
          return;
        }

        console.log(form.getValues().policies.toString());
        onSubmit({
          ...form.getValues(),
          budget: form.getValues().budget as number,
          policies: form.getValues().policies as Policy[],
          years: 10,
          country: countryCode!,
        });
      }}
    >
      <div className=" bg-green-50 p-10 pt-5 pb-10 rounded-xl">
        <div className="flex flex-row justify-between">
          <NumberInput
            {...form.getInputProps('budget')}
            label="Budget (any unit)"
            placeholder="1065"
            className="md:w-1/2 lg:w-1/3"
          />
          <div className=" pl-10 text-green-800">
            <p>Country: {country}</p>
          </div>
        </div>
        <div className="p-5"></div>
        <div className="mt-2 grid auto-rows-fr grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {form.getValues().policies.map((policy, i) => (
            <div id="policy-card" key={`col-${i}`}>
              <PolicyComponent
                currentIndicatorValues={currentIndicatorValues}
                indicators={indicators}
                policy={policy}
                getInputProps={(field) =>
                  form.getInputProps(`policies.${i}.${field}`)
                }
              ></PolicyComponent>
            </div>
          ))}
          <div
            id="new-policy"
            className="w-full flex-col gap-4 border border-green-300 bg-white rounded-lg flex items-center flex-wrap justify-center p-4"
          >
            <TextInput
              {...newPolicyNameForm.getInputProps('name')}
              className="w-full"
              placeholder="Policy A"
              label="New policy name"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addNewPolicy();
                }
              }}
            />
            <ActionIcon
              component="button"
              color="green"
              radius="100%"
              w="3.5rem"
              h="3.5rem"
              onClick={() => {
                addNewPolicy();
              }}
            >
              <FaPlus size="2.5rem" />
            </ActionIcon>
          </div>
        </div>
        <div className="mt-16">
          <Button
            id="submit"
            type="submit"
            mt="md"
            loading={predictionLoadingState === 'loading'}
          >
            Optimize
          </Button>
        </div>
      </div>
    </form>
  );
};

export default PredictionForm;
