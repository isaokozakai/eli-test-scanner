import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CameraModal from '../CameraModal';

jest.mock('react-native-vision-camera', () => ({
  Camera: () => null,
  useCameraDevice: () => ({ id: 'back' }),
  useCameraPermission: () => ({
    hasPermission: true,
    requestPermission: jest.fn(),
  }),
}));

describe('CameraModal', () => {
  it('renders correctly and handles close', () => {
    const onCloseMock = jest.fn();
    const { getByText } = render(<CameraModal onClose={onCloseMock} />);

    expect(getByText('Take Photo')).toBeTruthy();

    fireEvent.press(getByText('Close'));
    expect(onCloseMock).toHaveBeenCalled();
  });
});
