declare module 'world-countries.json' {
  type WorldCountryFeature = {
    type: 'Feature';
    properties: {
      name: string;
    };
    geometry: {
      type: string;
      coordinates: number[][][];
    };
    id: string;
  };

  type WorldCountries = {
    type: 'FeatureCollection';
    features: WorldCountryFeature[];
  };

  const value: WorldCountries;
  export default value;
}
