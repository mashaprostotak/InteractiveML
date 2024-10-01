export interface IndicatorChange {
  change: number;
  indicator: string;
  indicator_name_short: string;
}

export interface LifeLadderPrediction {
  mean: number;
  standard_deviation: number;
  year: number;
}
