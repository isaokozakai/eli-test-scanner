export const Camera = () => null;
export const useCameraDevice = () => ({
  id: 'mock-camera',
  name: 'Mock Camera',
  position: 'back',
});
export const useCameraPermission = () => ({
  hasPermission: true,
  requestPermission: async () => ({ granted: true }),
});
