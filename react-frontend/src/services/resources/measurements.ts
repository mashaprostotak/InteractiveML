import { Measurement } from '../../types/measurement';
import { apiGet } from '../api';

export function getMeasurements(indicators: string) {
  const query_string = 'v1/data/measurements' + '?indicators=' + indicators;
  return apiGet<Measurement[]>(query_string);
}
