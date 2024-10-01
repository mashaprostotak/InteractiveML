export interface Measurement {
  country_name: string;
  country_code: string;
  year: number;
  life_ladder: number;
  [key: string]: number | string;
}
