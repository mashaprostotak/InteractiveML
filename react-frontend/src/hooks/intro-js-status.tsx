import { useLocalStorage } from '@mantine/hooks';

export function useIntroJsStatus() {
  return useLocalStorage<{
    exploration?: boolean;
    predictions?: boolean;
  }>({
    key: 'introJsStatus',
    defaultValue: {},
    serialize: JSON.stringify,
    deserialize: (value) => ({
      exploration: false,
      predictions: false,
      ...JSON.parse(value ?? '{}'),
    }),
  });
}
