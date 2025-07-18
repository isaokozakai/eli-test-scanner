import '@testing-library/jest-native/extend-expect'
import { Alert } from 'react-native';

jest.spyOn(Alert, 'alert').mockImplementation(() => {});

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([]),
    ok: true,
  })
) as jest.Mock;