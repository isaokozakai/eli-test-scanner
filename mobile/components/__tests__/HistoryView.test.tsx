import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import HistoryScreen from '../HistoryScreen';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve([
        {
          id: 1,
          status: 'valid',
          created_at: '2025-07-01',
          thumbnail_path: 'dummy.jpg',
        },
      ]),
  }),
) as jest.Mock;

describe('HistoryScreen', () => {
  it('fetches and displays submissions', async () => {
    const mockOpenCamera = jest.fn();
    const { getByText } = render(<HistoryScreen openCamera={mockOpenCamera} />);

    await waitFor(() => {
      expect(getByText('valid')).toBeTruthy();
      expect(getByText('2025-07-01')).toBeTruthy();
    });

    fireEvent.press(getByText('Open Camera'));
    expect(mockOpenCamera).toHaveBeenCalled();
  });
});
