export interface Policy {
  name: string;
  change: number;
  cost: number;
  indicator: string;
  uncertainty: number;
  years: number;
  userSelection: boolean;
}

export interface FormPolicy {
  name: string;
  change: string | number;
  cost: string | number;
  indicator: string | null;
  uncertainty: string | number;
  years: string | number;
  userSelection: boolean;
}
