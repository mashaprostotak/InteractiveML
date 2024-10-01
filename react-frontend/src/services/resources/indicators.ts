import { Indicator } from '../../types/indicator';
import { IndicatorValue } from '../../types/indicator_value';
import { apiGet, apiPost } from '../api';

export function getIndicators() {
  return apiGet<Indicator[]>('v1/data/indicators');
}

export interface CurrentIndicatorRequestData {
  indicators: Indicator[];
  country_code: string;
  current_year: number;
}

export interface CurrentIndicatorResponseData {
  current_indicators: IndicatorValue[];
}

export function getCurrentIndicators(data: CurrentIndicatorRequestData) {
  return apiPost<CurrentIndicatorResponseData>(
    'v1/data/indicators/current',
    data
  );
}
