import { Policy } from '../../types/policy';
import { IndicatorChange, LifeLadderPrediction } from '../../types/prediction';
import { apiPost } from '../api';

export interface OptimalPolicyRequestData {
  policies: Policy[];
  budget: number;
  country: string;
  years: number;
}

export interface OptimalPolicyResponseData {
  indicator_changes: IndicatorChange[];
  policies: Policy[];
  predictions: LifeLadderPrediction[];
  used_budget: number;
}

export function predictionsOptimal(data: OptimalPolicyRequestData) {
  return apiPost('v1/predictions/optimal', data);
}

export function predictionsCustom(data: OptimalPolicyRequestData) {
  return apiPost('v1/predictions/custom', data);
}
