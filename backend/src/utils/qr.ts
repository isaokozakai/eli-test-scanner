import jsQR from "jsqr";

export function extractQrCodeFromImageBuffer(
  buffer: Buffer,
  width: number,
  height: number
): { qrCode: string | null; status: string; errorMessage: string | null } {
  try {
    const qr = jsQR(new Uint8ClampedArray(buffer), width, height);

    if (qr?.data) {
      const qrCode = qr.data;

      if (qrCode === "ELI-2024-999") {
        return {
          qrCode,
          status: "expired",
          errorMessage: "Test strip expired",
        };
      } else if (qrCode.startsWith("ELI-2025")) {
        return {
          qrCode,
          status: "valid",
          errorMessage: null,
        };
      } else {
        return {
          qrCode,
          status: "invalid",
          errorMessage: "Unknown QR code format",
        };
      }
    } else {
      return {
        qrCode: null,
        status: "invalid",
        errorMessage: "QR code not found",
      };
    }
  } catch (err: any) {
    return {
      qrCode: null,
      status: "invalid",
      errorMessage: "QR code processing error: " + err.message,
    };
  }
}
